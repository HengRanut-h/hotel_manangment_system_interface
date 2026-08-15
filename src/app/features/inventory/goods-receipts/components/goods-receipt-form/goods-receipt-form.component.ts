import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
  signal
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  LucideArrowLeft,
  LucideCheck,
  LucideClipboardList
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  GoodsReceiptsApiService
} from '../../data-access/goods-receipts-api.service';

import {
  PurchaseOrderLookupItem
} from '../../models/goods-receipt.model';

export interface GoodsReceiptFormValue {
  branchId: string | null;
  referenceNumber: string;
  title: string;
  notes: string | null;
  amount: number | null;
  eventAtUtc: string | null;
  relatedEntityId: string | null;
  relatedEntityType: string | null;
}

@Component({
  selector:
    'app-goods-receipt-form',

  standalone:
    true,

  imports: [
    FormsModule,
    TranslationPipe,
    LucideArrowLeft,
    LucideCheck,
    LucideClipboardList
  ],

  templateUrl:
    './goods-receipt-form.component.html',

  styleUrl:
    './goods-receipt-form.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class GoodsReceiptFormComponent {

  private readonly api =
    inject(GoodsReceiptsApiService);

  readonly initialBranchId =
    input<string | null>(null);

  readonly initialReferenceNumber =
    input('');

  readonly initialTitle =
    input('');

  readonly initialNotes =
    input<string | null>(null);

  readonly initialAmount =
    input<number | null>(null);

  readonly initialEventAtUtc =
    input<string | null>(null);

  readonly initialRelatedEntityId =
    input<string | null>(null);

  readonly initialRelatedEntityType =
    input<string | null>(null);

  readonly showReferenceNumber =
    input(true);

  readonly submitting =
    input(false);

  readonly submitLabel =
    input('goodsReceipts.save');

  readonly submitted =
    output<GoodsReceiptFormValue>();

  readonly cancelled =
    output<void>();

  readonly purchaseOrders =
    signal<PurchaseOrderLookupItem[]>([]);

  readonly purchaseOrdersLoading =
    signal(false);

  readonly referenceNumber =
    signal('');

  readonly title =
    signal('');

  readonly notes =
    signal('');

  readonly amount =
    signal('');

  readonly eventAtUtc =
    signal('');

  readonly relatedEntityId =
    signal('');

  readonly touched =
    signal(false);

  constructor() {

    this.loadPurchaseOrders();

    effect(
      () => {

        this.referenceNumber.set(
          this.initialReferenceNumber()
        );

        this.title.set(
          this.initialTitle()
        );

        this.notes.set(
          this.initialNotes()
          ??
          ''
        );

        this.amount.set(
          this.initialAmount() === null
            ? ''
            : String(
                this.initialAmount()
              )
        );

        this.eventAtUtc.set(
          this.toLocalDateTime(
            this.initialEventAtUtc()
          )
        );

        this.relatedEntityId.set(
          this.initialRelatedEntityType()
            ?.trim()
            .toLowerCase()
          === 'purchaseorder'
            ? (
                this.initialRelatedEntityId()
                ??
                ''
              )
            : ''
        );
      },
      {
        allowSignalWrites:
          true
      }
    );
  }

  isTitleInvalid(): boolean {

    return (
      this.touched()
      &&
      !this.title()
        .trim()
    );
  }

  isReferenceNumberInvalid():
    boolean {

    return (
      this.showReferenceNumber()
      &&
      this.touched()
      &&
      !this.referenceNumber()
        .trim()
    );
  }

  submit(): void {

    this.touched.set(true);

    if (
      this.submitting()
      ||
      this.isTitleInvalid()
      ||
      this.isReferenceNumberInvalid()
    ) {
      return;
    }

    const amountText =
      this.amount()
        .trim();

    const amount =
      amountText
        ? Number(amountText)
        : null;

    if (
      amount !== null
      &&
      !Number.isFinite(amount)
    ) {
      return;
    }

    const relatedEntityId =
      this.normalizeOptional(
        this.relatedEntityId()
      );

    this.submitted.emit({
      branchId:
        this.initialBranchId(),

      referenceNumber:
        this.referenceNumber()
          .trim(),

      title:
        this.title()
          .trim(),

      notes:
        this.normalizeOptional(
          this.notes()
        ),

      amount,

      eventAtUtc:
        this.normalizeDateTime(
          this.eventAtUtc()
        ),

      relatedEntityId,

      relatedEntityType:
        relatedEntityId
          ? 'PurchaseOrder'
          : null
    });
  }

  cancel(): void {

    if (
      this.submitting()
    ) {
      return;
    }

    this.cancelled.emit();
  }

  setReferenceNumber(
    event: Event
  ): void {

    const target =
      event.target;

    if (
      !(target instanceof HTMLInputElement)
    ) {
      return;
    }

    this.referenceNumber.set(
      target.value
    );
  }

  setTitle(
    event: Event
  ): void {

    const target =
      event.target;

    if (
      !(target instanceof HTMLInputElement)
    ) {
      return;
    }

    this.title.set(
      target.value
    );
  }

  setNotes(
    event: Event
  ): void {

    const target =
      event.target;

    if (
      !(target instanceof HTMLTextAreaElement)
    ) {
      return;
    }

    this.notes.set(
      target.value
    );
  }

  setAmount(
    event: Event
  ): void {

    const target =
      event.target;

    if (
      !(target instanceof HTMLInputElement)
    ) {
      return;
    }

    this.amount.set(
      target.value
    );
  }

  setEventAtUtc(
    event: Event
  ): void {

    const target =
      event.target;

    if (
      !(target instanceof HTMLInputElement)
    ) {
      return;
    }

    this.eventAtUtc.set(
      target.value
    );
  }

  setPurchaseOrder(
    event: Event
  ): void {

    const target =
      event.target;

    if (
      !(target instanceof HTMLSelectElement)
    ) {
      return;
    }

    this.relatedEntityId.set(
      target.value
    );
  }

  private loadPurchaseOrders():
    void {

    this.purchaseOrdersLoading.set(true);

    this.api
      .getPurchaseOrders()
      .subscribe({

        next:
          items => {

            this.purchaseOrders.set(
              Array.isArray(items)
                ? items
                : []
            );

            this.purchaseOrdersLoading.set(false);
          },

        error:
          () => {

            this.purchaseOrders.set([]);
            this.purchaseOrdersLoading.set(false);
          }
      });
  }

  private normalizeOptional(
    value: string
  ): string | null {

    const normalized =
      value.trim();

    return normalized
      ? normalized
      : null;
  }

  private normalizeDateTime(
    value: string
  ): string | null {

    const normalized =
      value.trim();

    if (!normalized) {
      return null;
    }

    const date =
      new Date(normalized);

    return Number.isNaN(
      date.getTime()
    )
      ? normalized
      : date.toISOString();
  }

  private toLocalDateTime(
    value: string | null
  ): string {

    if (!value) {
      return '';
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return value;
    }

    const pad =
      (number: number) =>
        String(number)
          .padStart(2, '0');

    return [
      date.getFullYear(),
      '-',
      pad(
        date.getMonth() + 1
      ),
      '-',
      pad(
        date.getDate()
      ),
      'T',
      pad(
        date.getHours()
      ),
      ':',
      pad(
        date.getMinutes()
      )
    ].join('');
  }
}
