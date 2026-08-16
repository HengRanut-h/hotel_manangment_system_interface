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
  DiscountUpsertRequest
} from '../../models/discount.model';

import {
  DiscountsApiService
} from '../../data-access/discounts-api.service';

import {
  DiscountFormComponent
} from '../../components/discount-form/discount-form.component';

@Component({
  selector:
    'app-discounts-create-page',

  standalone:
    true,

  imports: [
    RouterLink,
    TranslationPipe,
    DiscountFormComponent,
    LucideArrowLeft,
    LucidePlus
  ],

  templateUrl:
    './discounts-create.page.html',

  styleUrl:
    './discounts-create.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class DiscountsCreatePage {

  private readonly api =
    inject(DiscountsApiService);

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
      DiscountUpsertRequest
  ): void {

    if (
      this.submitting()
    ) {
      return;
    }

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
          discount =>
            this.router.navigate(
              [
                '/app/finance/discounts',
                discount.id
              ]
            ),

        error:
          error => {

            console.error(
              'Create discount API error',
              error
            );

            this.errorKey.set(
              'discounts.errors.create'
            );
          }
      });
  }

  cancel(): void {

    this.router.navigate(
      [
        '/app/finance/discounts'
      ]
    );
  }
}
