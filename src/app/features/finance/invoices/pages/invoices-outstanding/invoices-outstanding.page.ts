
import {
  DatePipe,
  DecimalPipe
} from '@angular/common';

import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';

import {
  RouterLink
} from '@angular/router';

import {
  LucideArrowLeft,
  LucideCalendarDays,
  LucideCircleDollarSign,
  LucideClipboardList,
  LucideEye,
  LucideRefreshCw,
  LucideTriangleAlert
} from '@lucide/angular';

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
  InvoiceStatusBadgeComponent
} from '../../components/invoice-status-badge/invoice-status-badge.component';

import {
  InvoicesApiService
} from '../../data-access/invoices-api.service';

import {
  Invoice
} from '../../models/invoice.model';

@Component({
  selector: 'app-invoices-outstanding-page',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe,
    RouterLink,
    TranslationPipe,
    SpinComponent,
    InvoiceStatusBadgeComponent,
    LucideArrowLeft,
    LucideCalendarDays,
    LucideCircleDollarSign,
    LucideClipboardList,
    LucideEye,
    LucideRefreshCw,
    LucideTriangleAlert
  ],
  templateUrl: './invoices-outstanding.page.html',
  styleUrl: './invoices-outstanding.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoicesOutstandingPage
  implements OnInit {

  private readonly api =
    inject(InvoicesApiService);

  private readonly translation =
    inject(TranslationService);

  readonly items = signal<Invoice[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal('');

  readonly outstandingItems = computed(
    () =>
      this.items()
        .filter(
          invoice =>
            invoice.balanceAmount > 0
        )
        .sort(
          (left, right) =>
            (left.dueDate || '')
              .localeCompare(
                right.dueDate || ''
              )
        )
  );

  readonly overdueItems = computed(
    () =>
      this.outstandingItems().filter(
        invoice => this.isOverdue(invoice)
      )
  );

  readonly dueSoonItems = computed(
    () =>
      this.outstandingItems().filter(
        invoice => this.isDueSoon(invoice)
      )
  );

  readonly outstandingAmount = computed(
    () =>
      this.outstandingItems().reduce(
        (total, invoice) =>
          total + invoice.balanceAmount,
        0
      )
  );

  readonly overdueAmount = computed(
    () =>
      this.overdueItems().reduce(
        (total, invoice) =>
          total + invoice.balanceAmount,
        0
      )
  );

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.api.getAll().subscribe({
      next: result => {
        this.items.set(result.items);
        this.loading.set(false);
      },

      error: error => {
        this.errorMessage.set(
          getSafeApiErrorMessage(
            error,
            this.translation.translate(
              'invoices.loadFailed'
            )
          )
        );
        this.loading.set(false);
      }
    });
  }

  isOverdue(invoice: Invoice): boolean {
    const due =
      this.dateOnly(invoice.dueDate);

    return (
      invoice.balanceAmount > 0 &&
      due !== null &&
      due.getTime() < this.today().getTime()
    );
  }

  isDueSoon(invoice: Invoice): boolean {
    const due =
      this.dateOnly(invoice.dueDate);

    if (
      invoice.balanceAmount <= 0 ||
      !due
    ) {
      return false;
    }

    const today = this.today();
    const upper = new Date(today);
    upper.setDate(
      upper.getDate() + 3
    );

    return (
      due.getTime() >= today.getTime() &&
      due.getTime() <= upper.getTime()
    );
  }

  daysRelativeToDue(
    invoice: Invoice
  ): number | null {
    const due =
      this.dateOnly(invoice.dueDate);

    if (!due) {
      return null;
    }

    return Math.round(
      (
        due.getTime() -
        this.today().getTime()
      )
      /
      86_400_000
    );
  }

  private dateOnly(
    value: string
  ): Date | null {
    if (!value) {
      return null;
    }

    const result =
      new Date(
        `${value.slice(0, 10)}T00:00:00`
      );

    return Number.isNaN(result.getTime())
      ? null
      : result;
  }

  private today(): Date {
    const now = new Date();

    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
  }
}
