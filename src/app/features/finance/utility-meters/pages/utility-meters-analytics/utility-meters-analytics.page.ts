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
  LucideGauge,
  LucideCircleCheck,
  LucideActivity
} from '@lucide/angular';

import {
  UtilityMeter
} from '../../models/utility-meter.model';

import {
  UtilityMetersApiService
} from '../../data-access/utility-meters-api.service';

@Component({
  selector:
    'app-utility-meters-analytics-page',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,
    LucideArrowLeft,
    LucideBarChart3,
    LucideGauge,
    LucideCircleCheck,
    LucideActivity
  ],

  templateUrl:
    './utility-meters-analytics.page.html',

  styleUrl:
    './utility-meters-analytics.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class UtilityMetersAnalyticsPage {

  private readonly api =
    inject(UtilityMetersApiService);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly items =
    signal<UtilityMeter[]>([]);

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

  readonly totalCurrentReading =
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
                item.currentReading ??
                item.initialReading ??
                0
              ),

            0
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
            this.items.set(
              result.items ??
              []
            ),

        error:
          error =>
            console.error(
              'Utility meter analytics error',
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
