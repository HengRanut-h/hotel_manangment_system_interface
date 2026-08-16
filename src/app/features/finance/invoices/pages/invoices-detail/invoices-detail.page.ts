
import {
  DatePipe,
  DecimalPipe
} from '@angular/common';

import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import {
  LucideArrowLeft,
  LucideCheckCircle2,
  LucideCircleDollarSign,
  LucideClipboardList,
  LucideEye,
  LucideRefreshCw,
  LucideWalletCards,
  LucideX
} from '@lucide/angular';

import {
  AuthStore
} from '../../../../../core/auth/auth.store';

import {
  getSafeApiErrorMessage
} from '../../../../../core/http/api-error.util';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  TranslationService
} from '../../../../../core/i18n/translation.service';

import {
  SpinComponent
} from '../../../../../shared/ui/spin/spin.component';

import {
  ToastService
} from '../../../../../shared/ui/toast/toast.service';

import {
  InvoicePaymentFormComponent
} from '../../components/invoice-payment-form/invoice-payment-form.component';

import {
  InvoiceStatusBadgeComponent
} from '../../components/invoice-status-badge/invoice-status-badge.component';

import {
  InvoicesApiService
} from '../../data-access/invoices-api.service';

import {
  Invoice,
  RecordInvoicePaymentRequest,
  ReservationLookup
} from '../../models/invoice.model';

@Component({
  selector: 'app-invoices-detail-page',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe,
    RouterLink,
    TranslationPipe,
    SpinComponent,
    InvoicePaymentFormComponent,
    InvoiceStatusBadgeComponent,
    LucideArrowLeft,
    LucideCheckCircle2,
    LucideCircleDollarSign,
    LucideClipboardList,
    LucideEye,
    LucideRefreshCw,
    LucideWalletCards,
    LucideX
  ],
  templateUrl: './invoices-detail.page.html',
  styleUrl: './invoices-detail.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoicesDetailPage
  implements OnInit, OnDestroy {

  readonly auth = inject(AuthStore);

  private readonly api =
    inject(InvoicesApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly toast =
    inject(ToastService);

  private readonly translation =
    inject(TranslationService);

  readonly invoice =
    signal<Invoice | null>(null);

  readonly reservations =
    signal<ReservationLookup[]>([]);

  readonly loading = signal(true);
  readonly refreshing = signal(false);
  readonly pdfLoading = signal(false);
  readonly recordingPayment = signal(false);
  readonly errorMessage = signal('');
  readonly paymentModalOpen = signal(false);
  readonly lastUpdated = signal<Date | null>(null);

  private refreshTimer:
    ReturnType<typeof setInterval> | null = null;

  readonly reservation = computed(
    () => {
      const invoice = this.invoice();

      if (
        !invoice ||
        !invoice.reservationId
      ) {
        return null;
      }

      return this.reservations().find(
        reservation =>
          reservation.id ===
          invoice.reservationId
      ) ?? null;
    }
  );

  readonly calculatedItemSubtotal =
    computed(
      () =>
        this.invoice()?.items.reduce(
          (total, item) =>
            total +
            item.quantity * item.unitPrice,
          0
        ) ?? 0
    );

  readonly paymentPercentage =
    computed(
      () => {
        const invoice = this.invoice();

        if (
          !invoice ||
          invoice.totalAmount <= 0
        ) {
          return 0;
        }

        return Math.min(
          100,
          Math.max(
            0,
            (
              invoice.paidAmount /
              invoice.totalAmount
            ) * 100
          )
        );
      }
    );

  ngOnInit(): void {
    this.loadReservations();
    this.load();

    this.refreshTimer = setInterval(
      () => this.load(true),
      60_000
    );
  }

  ngOnDestroy(): void {
    if (this.refreshTimer !== null) {
      clearInterval(this.refreshTimer);
    }
  }

  canRecordPayment(): boolean {
    return (
      this.auth.hasPermission(
        'invoices.update'
      ) ||
      this.auth.hasPermission(
        'invoices.manage'
      )
    );
  }

  load(silent = false): void {
    const id =
      this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.loading.set(false);
      this.errorMessage.set(
        this.translation.translate(
          'invoices.missingId'
        )
      );
      return;
    }

    if (silent) {
      this.refreshing.set(true);
    } else {
      this.loading.set(true);
    }

    this.errorMessage.set('');

    this.api.getById(id).subscribe({
      next: invoice => {
        this.invoice.set(invoice);
        this.lastUpdated.set(new Date());
        this.loading.set(false);
        this.refreshing.set(false);
      },

      error: error => {
        this.errorMessage.set(
          getSafeApiErrorMessage(
            error,
            this.translation.translate(
              'invoices.loadOneFailed'
            )
          )
        );
        this.loading.set(false);
        this.refreshing.set(false);
      }
    });
  }

  refresh(): void {
    if (
      this.loading() ||
      this.refreshing()
    ) {
      return;
    }

    this.load(true);
  }

  lineTotal(
    quantity: number,
    unitPrice: number
  ): number {
    return quantity * unitPrice;
  }

  isOverdue(invoice: Invoice): boolean {
    if (
      invoice.balanceAmount <= 0 ||
      !invoice.dueDate
    ) {
      return false;
    }

    const due =
      new Date(
        `${invoice.dueDate.slice(0, 10)}T00:00:00`
      );

    const now = new Date();

    const today =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );

    return (
      !Number.isNaN(due.getTime()) &&
      due.getTime() < today.getTime()
    );
  }

  openPaymentModal(): void {
    const invoice = this.invoice();

    if (
      !invoice ||
      invoice.balanceAmount <= 0 ||
      !this.canRecordPayment()
    ) {
      return;
    }

    this.paymentModalOpen.set(true);
  }

  closePaymentModal(): void {
    if (this.recordingPayment()) {
      return;
    }

    this.paymentModalOpen.set(false);
  }

  recordPayment(
    request: RecordInvoicePaymentRequest
  ): void {
    const invoice = this.invoice();

    if (
      !invoice ||
      this.recordingPayment() ||
      !this.canRecordPayment()
    ) {
      return;
    }

    if (
      request.amount >
      invoice.balanceAmount
    ) {
      this.toast.error(
        this.translation.translate(
          'invoices.paymentExceedsBalance'
        )
      );
      return;
    }

    this.recordingPayment.set(true);

    this.api.recordPayment(
      invoice.id,
      request
    ).subscribe({
      next: () => {
        this.recordingPayment.set(false);
        this.paymentModalOpen.set(false);

        this.toast.success(
          this.translation.translate(
            'invoices.paymentSuccess'
          )
        );

        this.load(true);
      },

      error: error => {
        this.recordingPayment.set(false);

        this.toast.error(
          getSafeApiErrorMessage(
            error,
            this.translation.translate(
              'invoices.paymentFailed'
            )
          )
        );
      }
    });
  }

  previewPdf(): void {
    const invoice = this.invoice();

    if (
      !invoice ||
      this.pdfLoading()
    ) {
      return;
    }

    this.pdfLoading.set(true);

    this.api.getPdf(invoice.id).subscribe({
      next: blob => {
        this.pdfLoading.set(false);

        const url =
          URL.createObjectURL(blob);

        window.open(
          url,
          '_blank',
          'noopener'
        );

        setTimeout(
          () => URL.revokeObjectURL(url),
          60_000
        );
      },

      error: error => {
        this.pdfLoading.set(false);

        this.toast.error(
          getSafeApiErrorMessage(
            error,
            this.translation.translate(
              'invoices.pdfFailed'
            )
          )
        );
      }
    });
  }

  downloadPdf(): void {
    const invoice = this.invoice();

    if (
      !invoice ||
      this.pdfLoading()
    ) {
      return;
    }

    this.pdfLoading.set(true);

    this.api.getPdf(invoice.id).subscribe({
      next: blob => {
        this.pdfLoading.set(false);

        const url =
          URL.createObjectURL(blob);

        const anchor =
          document.createElement('a');

        anchor.href = url;
        anchor.download =
          `${invoice.invoiceNumber || invoice.id}.pdf`;

        anchor.click();

        setTimeout(
          () => URL.revokeObjectURL(url),
          1_000
        );
      },

      error: error => {
        this.pdfLoading.set(false);

        this.toast.error(
          getSafeApiErrorMessage(
            error,
            this.translation.translate(
              'invoices.pdfFailed'
            )
          )
        );
      }
    });
  }

  private loadReservations(): void {
    this.api.getReservations().subscribe({
      next: reservations => {
        this.reservations.set(
          reservations
        );
      },

      error: () => {
        this.reservations.set([]);
      }
    });
  }
}
