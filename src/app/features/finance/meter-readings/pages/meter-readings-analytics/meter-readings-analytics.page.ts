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
  LucideActivity,
  LucideTrendingUp,
  LucideCircleDollarSign,
  LucideGauge
} from '@lucide/angular';

import {
  MeterReading
} from '../../models/meter-reading.model';

import {
  MeterReadingsApiService
} from '../../data-access/meter-readings-api.service';

@Component({
  selector:
    'app-meter-readings-analytics-page',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,
    LucideArrowLeft,
    LucideBarChart3,
    LucideActivity,
    LucideTrendingUp,
    LucideCircleDollarSign,
    LucideGauge
  ],

  templateUrl:
    './meter-readings-analytics.page.html',

  styleUrl:
    './meter-readings-analytics.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class MeterReadingsAnalyticsPage {

  private readonly api =
    inject(MeterReadingsApiService);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly items =
    signal<MeterReading[]>([]);

  readonly loading =
    signal(false);

  readonly total =
    computed(
      () =>
        this.items().length
    );

  readonly totalUsage =
    computed(
      () =>
        this.items()
          .reduce(
            (
              total,
              item
            ) =>
              total +
              Number(
                item.usage ||
                0
              ),

            0
          )
    );

  readonly totalAmount =
    computed(
      () =>
        this.items()
          .reduce(
            (
              total,
              item
            ) =>
              total +
              Number(
                item.amount ||
                0
              ),

            0
          )
    );

  readonly averageUsage =
    computed(
      () =>
        this.total()
          ? this.totalUsage() /
            this.total()
          : 0
    );

  readonly electricity =
    computed(
      () =>
        this.countType(
          'Electricity'
        )
    );

  readonly water =
    computed(
      () =>
        this.countType(
          'Water'
        )
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

        sortBy:
          'readingDateUtc',

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
              'Meter reading analytics error',
              error
            )
      });
  }

  private countType(
    type: string
  ): number {

    return this.items()
      .filter(
        item =>
          item.utilityType ===
          type
      )
      .length;
  }
}
