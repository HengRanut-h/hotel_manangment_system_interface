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
  Discount,
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
    'app-discounts-edit-page',

  standalone:
    true,

  imports: [
    RouterLink,
    TranslationPipe,
    DiscountFormComponent,
    LucideArrowLeft,
    LucidePencil
  ],

  templateUrl:
    './discounts-edit.page.html',

  styleUrl:
    './discounts-edit.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class DiscountsEditPage {

  private readonly api =
    inject(DiscountsApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly discount =
    signal<Discount | null>(
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
      !this.id
    ) {
      this.errorKey.set(
        'discounts.errors.missingId'
      );

      return;
    }

    this.load();
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
          value =>
            this.discount.set(
              value
            ),

        error:
          error => {

            console.error(
              'Load discount for edit error',
              error
            );

            this.errorKey.set(
              'discounts.errors.loadDetail'
            );
          }
      });
  }

  update(
    request:
      DiscountUpsertRequest
  ): void {

    if (
      !this.id ||
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
                '/app/finance/discounts',
                this.id
              ]
            ),

        error:
          error => {

            console.error(
              'Update discount API error',
              error
            );

            this.errorKey.set(
              'discounts.errors.update'
            );
          }
      });
  }

  cancel(): void {

    if (
      this.id
    ) {
      this.router.navigate(
        [
          '/app/finance/discounts',
          this.id
        ]
      );
    }
  }
}
