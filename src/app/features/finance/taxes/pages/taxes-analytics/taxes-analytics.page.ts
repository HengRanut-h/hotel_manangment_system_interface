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
  LucideBadgePercent,
  LucideCircleCheck,
  LucideCircleX
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  Tax
} from '../../models/tax.model';

import {
  TaxesApiService
} from '../../data-access/taxes-api.service';

@Component({
  selector:
    'app-taxes-analytics-page',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,
    TranslationPipe,
    LucideArrowLeft,
    LucideBarChart3,
    LucideBadgePercent,
    LucideCircleCheck,
    LucideCircleX
  ],

  templateUrl:
    './taxes-analytics.page.html',

  styleUrl:
    './taxes-analytics.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class TaxesAnalyticsPage {

  private readonly api =
    inject(TaxesApiService);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly taxes =
    signal<Tax[]>([]);

  readonly loading =
    signal(false);

  readonly errorKey =
    signal<string | null>(
      null
    );

  readonly total =
    computed(
      () =>
        this.taxes().length
    );

  readonly active =
    computed(
      () =>
        this.taxes()
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
        this.taxes()
          .filter(
            item =>
              !item.isActive &&
              !item.isDeleted
          )
          .length
    );

  readonly averageRate =
    computed(() => {

      const items =
        this.taxes();

      if (
        items.length ===
        0
      ) {
        return 0;
      }

      return items
        .reduce(
          (
            total,
            item
          ) =>
            total +
            Number(
              item.rate ||
              0
            ),

          0
        )
        /
        items.length;
    });

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
            this.taxes.set(
              result.items ??
              []
            ),

        error:
          error => {

            console.error(
              'Tax analytics error',
              error
            );

            this.errorKey.set(
              'taxes.errors.loadAnalytics'
            );
          }
      });
  }
}
