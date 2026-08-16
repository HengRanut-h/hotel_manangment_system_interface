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
  LucideBadgePercent
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  Tax,
  TaxUpsertRequest
} from '../../models/tax.model';

@Component({
  selector:
    'app-tax-form',

  standalone:
    true,

  imports: [
    FormsModule,
    TranslationPipe,
    LucideSave,
    LucideX,
    LucideBadgePercent
  ],

  templateUrl:
    './tax-form.component.html',

  styleUrl:
    './tax-form.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class TaxFormComponent
  implements OnChanges {

  readonly initialValue =
    input<Tax | null>(
      null
    );

  readonly submitting =
    input(false);

  readonly submitLabelKey =
    input(
      'taxes.actions.save'
    );

  readonly submitted =
    output<TaxUpsertRequest>();

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
    signal('VAT');

  readonly rate =
    signal<number | null>(
      null
    );

  readonly isPercentage =
    signal(true);

  readonly isInclusive =
    signal(false);

  readonly isActive =
    signal(true);

  readonly appliesTo =
    signal('All');

  readonly effectiveFrom =
    signal('');

  readonly effectiveTo =
    signal('');

  ngOnChanges(
    changes: SimpleChanges
  ): void {

    if (
      changes['initialValue']
    ) {
      this.loadInitialValue();
    }
  }

  rateInvalid(): boolean {

    const value =
      Number(
        this.rate()
      );

    if (
      !Number.isFinite(
        value
      ) ||
      value < 0
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
      !this.effectiveFrom() ||
      !this.effectiveTo()
    ) {
      return false;
    }

    return (
      new Date(
        this.effectiveTo()
      ) <
      new Date(
        this.effectiveFrom()
      )
    );
  }

  isInvalid(): boolean {

    return (
      !this.name().trim() ||
      !this.type() ||
      !this.appliesTo() ||
      this.rateInvalid() ||
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

      rate:
        Number(
          this.rate()
        ),

      isPercentage:
        this.isPercentage(),

      isInclusive:
        this.isInclusive(),

      isActive:
        this.isActive(),

      appliesTo:
        this.appliesTo(),

      effectiveFromUtc:
        this.toUtc(
          this.effectiveFrom()
        ),

      effectiveToUtc:
        this.toUtc(
          this.effectiveTo()
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
      'VAT'
    );

    this.rate.set(
      value.rate ??
      null
    );

    this.isPercentage.set(
      value.isPercentage ??
      true
    );

    this.isInclusive.set(
      value.isInclusive ??
      false
    );

    this.isActive.set(
      value.isActive ??
      true
    );

    this.appliesTo.set(
      value.appliesTo ??
      'All'
    );

    this.effectiveFrom.set(
      this.toLocalInput(
        value.effectiveFromUtc
      )
    );

    this.effectiveTo.set(
      this.toLocalInput(
        value.effectiveToUtc
      )
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
