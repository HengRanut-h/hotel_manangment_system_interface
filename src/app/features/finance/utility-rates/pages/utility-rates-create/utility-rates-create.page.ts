import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal
} from '@angular/core';

import {
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
  LucidePlus
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
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
    'app-utility-rates-create-page',

  standalone:
    true,

  imports: [
    RouterLink,
    TranslationPipe,
    UtilityRateFormComponent,
    LucideArrowLeft,
    LucidePlus
  ],

  templateUrl:
    './utility-rates-create.page.html',

  styleUrl:
    './utility-rates-create.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class UtilityRatesCreatePage {

  private readonly api =
    inject(UtilityRatesApiService);

  private readonly router =
    inject(Router);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly submitting =
    signal(false);

  readonly errorKey =
    signal<string | null>(
      null
    );

  create(
    request:
      UtilityRateUpsertRequest
  ): void {

    this.submitting.set(
      true
    );

    this.errorKey.set(
      null
    );

    this.api
      .create(
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
          item =>
            this.router.navigate(
              [
                '/app/finance/utility-rates',
                item.id
              ]
            ),

        error:
          error => {

            console.error(
              'Create utility rate error',
              error
            );

            this.errorKey.set(
              'utilityRates.errors.create'
            );
          }
      });
  }

  cancel(): void {

    this.router.navigate(
      [
        '/app/finance/utility-rates'
      ]
    );
  }
}
