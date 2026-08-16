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
  LucideBadgeDollarSign
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  UtilityRate,
  UtilityRateUpsertRequest
} from '../../models/utility-rate.model';

@Component({
  selector:
    'app-utility-rate-form',

  standalone:
    true,

  imports: [
    FormsModule,
    TranslationPipe,
    LucideSave,
    LucideX,
    LucideBadgeDollarSign
  ],

  templateUrl:
    './utility-rate-form.component.html',

  styleUrl:
    './utility-rate-form.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class UtilityRateFormComponent
  implements OnChanges {

  readonly initialValue =
    input<UtilityRate | null>(
      null
    );

  readonly submitting =
    input(false);

  readonly submitLabelKey =
    input(
      'utilityRates.actions.save'
    );

  readonly submitted =
    output<UtilityRateUpsertRequest>();

  readonly cancelled =
    output<void>();

  readonly touched =
    signal(false);

  readonly utilityId =
    signal('');

  readonly name =
    signal('');

  readonly code =
    signal('');

  readonly ratePerUnit =
    signal<number | null>(
      null
    );

  readonly unit =
    signal('');

  readonly currency =
    signal('USD');

  readonly minimumCharge =
    signal<number | null>(
      null
    );

  readonly fixedCharge =
    signal<number | null>(
      null
    );

  readonly effectiveFrom =
    signal('');

  readonly effectiveTo =
    signal('');

  readonly isActive =
    signal(true);

  readonly notes =
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

    const rate =
      Number(
        this.ratePerUnit()
      );

    return (
      !Number.isFinite(
        rate
      ) ||
      rate < 0
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
      !this.utilityId().trim() ||
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
      utilityId:
        this.utilityId()
          .trim(),

      name:
        this.optionalText(
          this.name()
        ),

      code:
        this.optionalText(
          this.code()
        ),

      ratePerUnit:
        Number(
          this.ratePerUnit()
        ),

      unit:
        this.optionalText(
          this.unit()
        ),

      currency:
        this.optionalText(
          this.currency()
        ),

      minimumCharge:
        this.optionalNumber(
          this.minimumCharge()
        ),

      fixedCharge:
        this.optionalNumber(
          this.fixedCharge()
        ),

      effectiveFromUtc:
        this.toUtc(
          this.effectiveFrom()
        ),

      effectiveToUtc:
        this.toUtc(
          this.effectiveTo()
        ),

      isActive:
        this.isActive(),

      notes:
        this.optionalText(
          this.notes()
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

    const item =
      this.initialValue();

    if (
      !item
    ) {
      return;
    }

    this.utilityId.set(
      item.utilityId ??
      ''
    );

    this.name.set(
      item.name ??
      ''
    );

    this.code.set(
      item.code ??
      ''
    );

    this.ratePerUnit.set(
      item.ratePerUnit ??
      null
    );

    this.unit.set(
      item.unit ??
      ''
    );

    this.currency.set(
      item.currency ??
      'USD'
    );

    this.minimumCharge.set(
      item.minimumCharge ??
      null
    );

    this.fixedCharge.set(
      item.fixedCharge ??
      null
    );

    this.effectiveFrom.set(
      this.toLocalInput(
        item.effectiveFromUtc
      )
    );

    this.effectiveTo.set(
      this.toLocalInput(
        item.effectiveToUtc
      )
    );

    this.isActive.set(
      item.isActive ??
      true
    );

    this.notes.set(
      item.notes ??
      ''
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
