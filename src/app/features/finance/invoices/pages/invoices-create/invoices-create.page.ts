
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
  Router,
  RouterLink
} from '@angular/router';

import {
  LucideArrowLeft,
  LucideCheckCircle2,
  LucideCirclePlus,
  LucideClipboardList,
  LucideRefreshCw,
  LucideTrash2
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
  ToastService
} from '../../../../../shared/ui/toast/toast.service';

import {
  InvoicesApiService
} from '../../data-access/invoices-api.service';

import {
  CreateInvoiceItemRequest,
  InvoiceItemDraft,
  ReservationLookup
} from '../../models/invoice.model';

@Component({
  selector: 'app-invoices-create-page',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe,
    RouterLink,
    TranslationPipe,
    SpinComponent,
    LucideArrowLeft,
    LucideCheckCircle2,
    LucideCirclePlus,
    LucideClipboardList,
    LucideRefreshCw,
    LucideTrash2
  ],
  templateUrl: './invoices-create.page.html',
  styleUrl: './invoices-create.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoicesCreatePage
  implements OnInit {

  private readonly api =
    inject(InvoicesApiService);

  private readonly router =
    inject(Router);

  private readonly toast =
    inject(ToastService);

  private readonly translation =
    inject(TranslationService);

  readonly reservations =
    signal<ReservationLookup[]>([]);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly errorMessage = signal('');

  readonly selectedReservationId =
    signal('');

  readonly invoiceDate =
    signal(
      this.formatDateInput(new Date())
    );

  readonly dueDate =
    signal(
      this.formatDateInput(
        this.addDays(new Date(), 2)
      )
    );

  readonly discountAmount = signal('0');
  readonly taxAmount = signal('0');

  readonly items =
    signal<InvoiceItemDraft[]>([
      this.emptyItem()
    ]);

  readonly selectedReservation =
    computed(
      () =>
        this.reservations().find(
          reservation =>
            reservation.id ===
            this.selectedReservationId()
        ) ?? null
    );

  readonly calculatedSubtotal =
    computed(
      () =>
        this.items().reduce(
          (total, item) =>
            total + this.lineTotal(item),
          0
        )
    );

  readonly calculatedTotal =
    computed(
      () =>
        Math.max(
          0,
          this.calculatedSubtotal()
          -
          this.numberValue(
            this.discountAmount()
          )
          +
          this.numberValue(
            this.taxAmount()
          )
        )
    );

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.api.getReservations().subscribe({
      next: reservations => {
        this.reservations.set(
          reservations
        );
        this.loading.set(false);
      },

      error: error => {
        this.errorMessage.set(
          getSafeApiErrorMessage(
            error,
            this.translation.translate(
              'invoices.reservationsLoadFailed'
            )
          )
        );
        this.loading.set(false);
      }
    });
  }

  setReservation(event: Event): void {
    const target = event.target;

    if (
      !(target instanceof HTMLSelectElement)
    ) {
      return;
    }

    this.selectedReservationId.set(
      target.value
    );

    const reservation =
      this.reservations().find(
        item => item.id === target.value
      );

    if (
      reservation &&
      this.items().length === 1 &&
      !this.items()[0].description.trim()
    ) {
      const nights =
        this.nights(
          reservation.checkInDate,
          reservation.checkOutDate
        );

      const description =
        [
          reservation.roomTypeName,
          nights > 0
            ? `${nights} night${nights === 1 ? '' : 's'}`
            : ''
        ]
          .filter(Boolean)
          .join(' - ');

      this.items.set([
        {
          description,
          quantity: String(
            Math.max(1, nights)
          ),
          unit: 'night',
          unitPrice:
            reservation.nightlyRate > 0
              ? reservation.nightlyRate.toFixed(2)
              : ''
        }
      ]);
    }
  }

  setInvoiceDate(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      this.invoiceDate.set(target.value);
    }
  }

  setDueDate(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      this.dueDate.set(target.value);
    }
  }

  setDiscount(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      this.discountAmount.set(
        target.value
      );
    }
  }

  setTax(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      this.taxAmount.set(target.value);
    }
  }

  addItem(): void {
    this.items.update(
      items => [
        ...items,
        this.emptyItem()
      ]
    );
  }

  removeItem(index: number): void {
    if (this.items().length <= 1) {
      return;
    }

    this.items.update(
      items =>
        items.filter(
          (_, itemIndex) =>
            itemIndex !== index
        )
    );
  }

  setItemDescription(
    index: number,
    event: Event
  ): void {
    const target = event.target;

    if (target instanceof HTMLInputElement) {
      this.patchItem(
        index,
        { description: target.value }
      );
    }
  }

  setItemQuantity(
    index: number,
    event: Event
  ): void {
    const target = event.target;

    if (target instanceof HTMLInputElement) {
      this.patchItem(
        index,
        { quantity: target.value }
      );
    }
  }

  setItemUnit(
    index: number,
    event: Event
  ): void {
    const target = event.target;

    if (target instanceof HTMLInputElement) {
      this.patchItem(
        index,
        { unit: target.value }
      );
    }
  }

  setItemUnitPrice(
    index: number,
    event: Event
  ): void {
    const target = event.target;

    if (target instanceof HTMLInputElement) {
      this.patchItem(
        index,
        { unitPrice: target.value }
      );
    }
  }

  lineTotal(
    item: InvoiceItemDraft
  ): number {
    const quantity = Number(item.quantity);
    const unitPrice = Number(item.unitPrice);

    return (
      Number.isFinite(quantity) &&
      Number.isFinite(unitPrice)
    )
      ? quantity * unitPrice
      : 0;
  }

  valid(): boolean {
    const reservation =
      this.selectedReservation();

    if (
      !reservation ||
      !reservation.guestId ||
      !this.invoiceDate() ||
      !this.dueDate() ||
      this.dueDate() < this.invoiceDate()
    ) {
      return false;
    }

    if (
      this.numberValue(
        this.discountAmount()
      ) < 0 ||
      this.numberValue(
        this.taxAmount()
      ) < 0
    ) {
      return false;
    }

    return this.items().every(
      item => {
        const quantity =
          Number(item.quantity);

        const unitPrice =
          Number(item.unitPrice);

        return (
          item.description.trim().length > 0 &&
          item.unit.trim().length > 0 &&
          Number.isFinite(quantity) &&
          quantity > 0 &&
          Number.isFinite(unitPrice) &&
          unitPrice >= 0
        );
      }
    );
  }

  submit(): void {
    const reservation =
      this.selectedReservation();

    if (
      !reservation ||
      !this.valid() ||
      this.saving()
    ) {
      return;
    }

    const items:
      CreateInvoiceItemRequest[] =
      this.items().map(
        item => ({
          description:
            item.description.trim(),
          quantity:
            Number(item.quantity),
          unit:
            item.unit.trim(),
          unitPrice:
            Number(item.unitPrice)
        })
      );

    this.saving.set(true);

    this.api.create({
      guestId:
        reservation.guestId,
      reservationId:
        reservation.id,
      invoiceDate:
        this.invoiceDate(),
      dueDate:
        this.dueDate(),
      discountAmount:
        this.numberValue(
          this.discountAmount()
        ),
      taxAmount:
        this.numberValue(
          this.taxAmount()
        ),
      items
    }).subscribe({
      next: invoice => {
        this.saving.set(false);

        this.toast.success(
          this.translation.translate(
            'invoices.createSuccess'
          )
        );

        void this.router.navigate([
          '/app/front-office/invoices',
          invoice.id
        ]);
      },

      error: error => {
        this.saving.set(false);

        this.toast.error(
          getSafeApiErrorMessage(
            error,
            this.translation.translate(
              'invoices.createFailed'
            )
          )
        );
      }
    });
  }

  private patchItem(
    index: number,
    patch: Partial<InvoiceItemDraft>
  ): void {
    this.items.update(
      items =>
        items.map(
          (item, itemIndex) =>
            itemIndex === index
              ? { ...item, ...patch }
              : item
        )
    );
  }

  private emptyItem():
    InvoiceItemDraft {
    return {
      description: '',
      quantity: '1',
      unit: '',
      unitPrice: ''
    };
  }

  private numberValue(
    value: string
  ): number {
    const result = Number(value);

    return Number.isFinite(result)
      ? result
      : 0;
  }

  private nights(
    checkIn: string,
    checkOut: string
  ): number {
    if (!checkIn || !checkOut) {
      return 0;
    }

    const start =
      new Date(
        `${checkIn.slice(0, 10)}T00:00:00`
      );

    const end =
      new Date(
        `${checkOut.slice(0, 10)}T00:00:00`
      );

    return Math.max(
      0,
      Math.round(
        (end.getTime() - start.getTime())
        /
        86_400_000
      )
    );
  }

  private addDays(
    date: Date,
    days: number
  ): Date {
    const result = new Date(date);
    result.setDate(
      result.getDate() + days
    );
    return result;
  }

  private formatDateInput(
    date: Date
  ): string {
    const year = date.getFullYear();

    const month =
      String(date.getMonth() + 1)
        .padStart(2, '0');

    const day =
      String(date.getDate())
        .padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
