import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  SimpleChanges,
  input,
  output,
  signal
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  LucideSave,
  LucideX,
  LucideTicketPercent
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  Discount,
  DiscountUpsertRequest
} from '../../models/discount.model';

@Component({
  selector:
    'app-discount-form',

  standalone:
    true,

  imports: [
    FormsModule,
    TranslationPipe,
    LucideSave,
    LucideX,
    LucideTicketPercent
  ],

  templateUrl:
    './discount-form.component.html',

  styleUrl:
    './discount-form.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class DiscountFormComponent
  implements OnChanges {

  readonly initialValue =
    input<Discount | null>(
      null
    );

  readonly submitting =
    input(false);

  readonly submitLabelKey =
    input(
      'discounts.actions.save'
    );

  readonly submitted =
    output<DiscountUpsertRequest>();

  readonly cancelled =
    output<void>();

  readonly touched =
    signal(false);

  readonly name =
    signal('');

  readonly code =
    signal('');

  readonly description =
    signal('');

  readonly type =
    signal('Percentage');

  readonly value =
    signal<number | null>(
      null
    );

  readonly isPercentage =
    signal(true);

  readonly isActive =
    signal(true);

  readonly appliesTo =
    signal('All');

  readonly minimumAmount =
    signal<number | null>(
      null
    );

  readonly maximumDiscountAmount =
    signal<number | null>(
      null
    );

  readonly validFrom =
    signal('');

  readonly validTo =
    signal('');

  readonly usageLimit =
    signal<number | null>(
      null
    );

  ngOnChanges(
    changes: SimpleChanges
  ): void {

    if (
      changes['initialValue']
    ) {
      this.loadInitialValue();
    }
  }

  setType(
    value: string
  ): void {

    this.type.set(
      value
    );

    if (
      value ===
      'Percentage'
    ) {
      this.isPercentage.set(
        true
      );
    }

    if (
      value ===
      'FixedAmount'
    ) {
      this.isPercentage.set(
        false
      );
    }
  }

  valueInvalid(): boolean {

    const value =
      Number(
        this.value()
      );

    if (
      !Number.isFinite(
        value
      ) ||
      value <= 0
    ) {
      return true;
    }

    return (
      this.isPercentage() &&
      value > 100
    );
  }

  dateRangeInvalid(): boolean {

    if (
      !this.validFrom() ||
      !this.validTo()
    ) {
      return false;
    }

    return (
      new Date(
        this.validTo()
      ) <
      new Date(
        this.validFrom()
      )
    );
  }

  isInvalid(): boolean {

    return (
      !this.name().trim() ||
      !this.type() ||
      !this.appliesTo() ||
      this.valueInvalid() ||
      this.dateRangeInvalid()
    );
  }

  submit(): void {

    this.touched.set(
      true
    );

    if (
      this.isInvalid() ||
      this.submitting()
    ) {
      return;
    }

    this.submitted.emit({
      name:
        this.name()
          .trim(),

      code:
        this.optionalText(
          this.code()
        ),

      description:
        this.optionalText(
          this.description()
        ),

      type:
        this.type(),

      value:
        Number(
          this.value()
        ),

      isPercentage:
        this.isPercentage(),

      isActive:
        this.isActive(),

      appliesTo:
        this.appliesTo(),

      minimumAmount:
        this.optionalNumber(
          this.minimumAmount()
        ),

      maximumDiscountAmount:
        this.optionalNumber(
          this.maximumDiscountAmount()
        ),

      validFromUtc:
        this.toUtc(
          this.validFrom()
        ),

      validToUtc:
        this.toUtc(
          this.validTo()
        ),

      usageLimit:
        this.optionalNumber(
          this.usageLimit()
        )
    });
  }

  cancel(): void {

    if (
      !this.submitting()
    ) {
      this.cancelled.emit();
    }
  }

  private loadInitialValue(): void {

    const value =
      this.initialValue();

    if (
      !value
    ) {
      return;
    }

    this.name.set(
      value.name ??
      ''
    );

    this.code.set(
      value.code ??
      ''
    );

    this.description.set(
      value.description ??
      ''
    );

    this.type.set(
      value.type ??
      'Percentage'
    );

    this.value.set(
      value.value ??
      null
    );

    this.isPercentage.set(
      value.isPercentage ??
      value.type ===
        'Percentage'
    );

    this.isActive.set(
      value.isActive ??
      true
    );

    this.appliesTo.set(
      value.appliesTo ??
      'All'
    );

    this.minimumAmount.set(
      value.minimumAmount ??
      null
    );

    this.maximumDiscountAmount.set(
      value.maximumDiscountAmount ??
      null
    );

    this.validFrom.set(
      this.toLocalInput(
        value.validFromUtc
      )
    );

    this.validTo.set(
      this.toLocalInput(
        value.validToUtc
      )
    );

    this.usageLimit.set(
      value.usageLimit ??
      null
    );
  }

  private optionalText(
    value: string
  ): string | null {

    const normalized =
      value.trim();

    return normalized ||
      null;
  }

  private optionalNumber(
    value: number | null
  ): number | null {

    if (
      value === null ||
      value === undefined
    ) {
      return null;
    }

    const normalized =
      Number(
        value
      );

    return Number.isFinite(
      normalized
    )
      ? normalized
      : null;
  }

  private toUtc(
    value: string
  ): string | null {

    if (
      !value
    ) {
      return null;
    }

    const date =
      new Date(
        value
      );

    return Number.isNaN(
      date.getTime()
    )
      ? null
      : date.toISOString();
  }

  private toLocalInput(
    value?: string | null
  ): string {

    if (
      !value
    ) {
      return '';
    }

    const date =
      new Date(
        value
      );

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return '';
    }

    const local =
      new Date(
        date.getTime() -
        date.getTimezoneOffset() *
        60000
      );

    return local
      .toISOString()
      .slice(
        0,
        16
      );
  }
}
