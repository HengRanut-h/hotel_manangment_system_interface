import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import {
  finalize
} from 'rxjs';

import {
  takeUntilDestroyed
} from '@angular/core/rxjs-interop';

import {
  LucideArrowLeft,
  LucideSave,
  LucideBadgeDollarSign
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  UtilityRate,
  UtilityRateRequest
} from '../../models/utility-rate.model';

import {
  UtilityRatesApiService
} from '../../data-access/utility-rates-api.service';

@Component({
  selector:
    'app-rates-edit-page',

  standalone:
    true,

  imports: [
    FormsModule,
    RouterLink,
    TranslationPipe,
    LucideArrowLeft,
    LucideSave,
    LucideBadgeDollarSign
  ],

  templateUrl:
    './rates-edit.page.html',

  styleUrl:
    './rates-edit.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class UtilityRateEditPage {

  private readonly api =
    inject(UtilityRatesApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly loading =
    signal(false);

  readonly submitting =
    signal(false);

  readonly id =
    this.route.snapshot.paramMap.get(
      'id'
    );


readonly utilityId = signal('');
readonly name = signal('');
readonly ratePerUnit = signal<number | null>(null);
readonly currency = signal('USD');
readonly effectiveFrom = signal('');
readonly effectiveTo = signal('');
readonly isActive = signal(true);

buildRequest():
  UtilityRateRequest | null {

  if (
    !this.utilityId().trim() ||
    this.ratePerUnit() === null
  ) {
    return null;
  }

  return {
    utilityId:
      this.utilityId().trim(),

    name:
      this.name().trim() ||
      null,

    ratePerUnit:
      Number(
        this.ratePerUnit()
      ),

    currency:
      this.currency().trim() ||
      null,

    effectiveFromUtc:
      this.toUtc(
        this.effectiveFrom()
      ),

    effectiveToUtc:
      this.toUtc(
        this.effectiveTo()
      ),

    isActive:
      this.isActive()
  };
}

loadFrom(
  item: UtilityRate
): void {

  this.utilityId.set(
    item.utilityId ??
    ''
  );

  this.name.set(
    item.name ??
    ''
  );

  this.ratePerUnit.set(
    item.ratePerUnit ??
    null
  );

  this.currency.set(
    item.currency ??
    'USD'
  );

  this.effectiveFrom.set(
    this.toLocal(
      item.effectiveFromUtc
    )
  );

  this.effectiveTo.set(
    this.toLocal(
      item.effectiveToUtc
    )
  );

  this.isActive.set(
    item.isActive ??
    true
  );
}

private toUtc(
  value: string
): string | null {

  if (
    !value
  ) {
    return null;
  }

  return new Date(
    value
  ).toISOString();
}

private toLocal(
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


  constructor() {

    if (
      this.id
    ) {
      this.load();
    }
  }

  load(): void {

    if (
      !this.id
    ) {
      return;
    }

    this.loading.set(
      true
    );

    this.api
      .getById(
        this.id
      )
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        ),

        finalize(
          () =>
            this.loading.set(
              false
            )
        )
      )
      .subscribe({
        next:
          item =>
            this.loadFrom(
              item
            ),

        error:
          error =>
            console.error(
              'Load UtilityRate error',
              error
            )
      });
  }

  save(): void {

    if (
      !this.id
    ) {
      return;
    }

    const request =
      this.buildRequest();

    if (
      !request
    ) {
      return;
    }

    this.submitting.set(
      true
    );

    this.api
      .update(
        this.id,
        request
      )
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        ),

        finalize(
          () =>
            this.submitting.set(
              false
            )
        )
      )
      .subscribe({
        next:
          () =>
            this.router.navigate(
              [
                '/app/finance/utility-billing/rates',
                this.id
              ]
            ),

        error:
          error =>
            console.error(
              'Update UtilityRate error',
              error
            )
      });
  }
}
