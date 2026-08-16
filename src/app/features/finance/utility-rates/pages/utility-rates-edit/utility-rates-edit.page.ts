import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal
} from '@angular/core';

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
  LucidePencil
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  UtilityRate,
  UtilityRateUpsertRequest
} from '../../models/utility-rate.model';

import {
  UtilityRatesApiService
} from '../../data-access/utility-rates-api.service';

import {
  UtilityRateFormComponent
} from '../../components/utility-rate-form/utility-rate-form.component';

@Component({
  selector:
    'app-utility-rates-edit-page',

  standalone:
    true,

  imports: [
    RouterLink,
    TranslationPipe,
    UtilityRateFormComponent,
    LucideArrowLeft,
    LucidePencil
  ],

  templateUrl:
    './utility-rates-edit.page.html',

  styleUrl:
    './utility-rates-edit.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class UtilityRatesEditPage {

  private readonly api =
    inject(UtilityRatesApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly item =
    signal<UtilityRate | null>(
      null
    );

  readonly loading =
    signal(false);

  readonly submitting =
    signal(false);

  readonly errorKey =
    signal<string | null>(
      null
    );

  readonly id =
    this.route
      .snapshot
      .paramMap
      .get(
        'id'
      );

  constructor() {

    if (
      this.id
    ) {
      this.load();
    } else {
      this.errorKey.set(
        'utilityRates.errors.missingId'
      );
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
            this.item.set(
              item
            ),

        error:
          error => {

            console.error(
              'Load utility rate edit error',
              error
            );

            this.errorKey.set(
              'utilityRates.errors.loadDetail'
            );
          }
      });
  }

  update(
    request:
      UtilityRateUpsertRequest
  ): void {

    if (
      !this.id
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
                '/app/finance/utility-rates',
                this.id
              ]
            ),

        error:
          error => {

            console.error(
              'Update utility rate error',
              error
            );

            this.errorKey.set(
              'utilityRates.errors.update'
            );
          }
      });
  }

  cancel(): void {

    this.router.navigate(
      this.id
        ? [
            '/app/finance/utility-rates',
            this.id
          ]
        : [
            '/app/finance/utility-rates'
          ]
    );
  }
}
