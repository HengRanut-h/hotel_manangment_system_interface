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
  LucideBadgeDollarSign,
  LucideCircleCheck
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  UtilityRate
} from '../../models/utility-rate.model';

import {
  UtilityRatesApiService
} from '../../data-access/utility-rates-api.service';

@Component({
  selector:
    'app-utility-rates-analytics-page',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,
    TranslationPipe,
    LucideArrowLeft,
    LucideBarChart3,
    LucideBadgeDollarSign,
    LucideCircleCheck
  ],

  templateUrl:
    './utility-rates-analytics.page.html',

  styleUrl:
    './utility-rates-analytics.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class UtilityRatesAnalyticsPage {

  private readonly api =
    inject(UtilityRatesApiService);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly items =
    signal<UtilityRate[]>([]);

  readonly loading =
    signal(false);

  readonly total =
    computed(
      () =>
        this.items().length
    );

  readonly active =
    computed(
      () =>
        this.items()
          .filter(
            item =>
              item.isActive &&
              !item.isDeleted
          )
          .length
    );

  readonly averageRate =
    computed(() => {

      const rows =
        this.items();

      if (
        rows.length ===
        0
      ) {
        return 0;
      }

      return rows
        .reduce(
          (
            total,
            item
          ) =>
            total +
            Number(
              item.ratePerUnit ||
              0
            ),

          0
        )
        /
        rows.length;
    });

  readonly maxRate =
    computed(() => {

      const rows =
        this.items();

      return rows.length
        ? Math.max(
            ...rows.map(
              item =>
                Number(
                  item.ratePerUnit ||
                  0
                )
            )
          )
        : 0;
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
          1000,

        sortBy:
          'ratePerUnit',

        sortDirection:
          'desc'
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
            this.items.set(
              result.items ??
              []
            ),

        error:
          error =>
            console.error(
              'Utility rate analytics error',
              error
            )
      });
  }
}
