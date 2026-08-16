import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
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
  LucideBarChart3,
  LucideTicketPercent,
  LucideCircleCheck,
  LucideCircleX
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  Discount
} from '../../models/discount.model';

import {
  DiscountsApiService
} from '../../data-access/discounts-api.service';

@Component({
  selector:
    'app-discounts-analytics-page',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,
    TranslationPipe,
    LucideArrowLeft,
    LucideBarChart3,
    LucideTicketPercent,
    LucideCircleCheck,
    LucideCircleX
  ],

  templateUrl:
    './discounts-analytics.page.html',

  styleUrl:
    './discounts-analytics.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class DiscountsAnalyticsPage {

  private readonly api =
    inject(DiscountsApiService);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly discounts =
    signal<Discount[]>([]);

  readonly loading =
    signal(false);

  readonly errorKey =
    signal<string | null>(
      null
    );

  readonly total =
    computed(
      () =>
        this.discounts().length
    );

  readonly active =
    computed(
      () =>
        this.discounts()
          .filter(
            item =>
              item.isActive &&
              !item.isDeleted
          )
          .length
    );

  readonly inactive =
    computed(
      () =>
        this.discounts()
          .filter(
            item =>
              !item.isActive &&
              !item.isDeleted
          )
          .length
    );

  readonly percentage =
    computed(
      () =>
        this.discounts()
          .filter(
            item =>
              item.type ===
              'Percentage'
          )
          .length
    );

  constructor() {
    this.load();
  }

  load(): void {

    this.loading.set(
      true
    );

    this.api
      .getAll({
        pageNumber:
          1,

        pageSize:
          1000
      })
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
          result =>
            this.discounts.set(
              result.items ??
              []
            ),

        error:
          error => {

            console.error(
              'Discount analytics error',
              error
            );

            this.errorKey.set(
              'discounts.errors.loadAnalytics'
            );
          }
      });
  }
}
