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
  LucideFlag,
  LucideToggleRight,
  LucideGauge,
  LucideServer
} from '@lucide/angular';

import {
  FeatureFlag
} from '../../models/feature-flag.model';

import {
  FeatureFlagsApiService
} from '../../data-access/feature-flags-api.service';

@Component({
  selector:
    'app-feature-flags-analytics-page',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,
    LucideArrowLeft,
    LucideBarChart3,
    LucideFlag,
    LucideToggleRight,
    LucideGauge,
    LucideServer
  ],

  templateUrl:
    './feature-flags-analytics.page.html',

  styleUrl:
    './feature-flags-analytics.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class FeatureFlagsAnalyticsPage {

  private readonly api =
    inject(FeatureFlagsApiService);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly items =
    signal<FeatureFlag[]>([]);

  readonly loading =
    signal(false);

  readonly total =
    computed(
      () =>
        this.items().length
    );

  readonly enabled =
    computed(
      () =>
        this.items()
          .filter(
            item =>
              item.isEnabled &&
              !item.isDeleted
          )
          .length
    );

  readonly averageRollout =
    computed(() => {

      const rows =
        this.items()
          .filter(
            item =>
              !item.isDeleted
          );

      return rows.length
        ? rows.reduce(
            (
              total,
              item
            ) =>
              total +
              Number(
                item.rolloutPercentage ??
                100
              ),
            0
          ) / rows.length
        : 0;
    });

  readonly production =
    computed(
      () =>
        this.items()
          .filter(
            item =>
              item.environment ===
              'Production'
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
          1000,

        includeDeleted:
          false,

        sortBy:
          'name',

        sortDirection:
          'asc'
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
              'Feature flag analytics error',
              error
            )
      });
  }
}
