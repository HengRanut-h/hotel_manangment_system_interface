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
  forkJoin,
  finalize
} from 'rxjs';

import {
  takeUntilDestroyed
} from '@angular/core/rxjs-interop';

import {
  LucideGauge,
  LucideZap,
  LucideBadgeDollarSign,
  LucideActivity,
  LucideBarChart3
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  UtilitiesApiService
} from '../../data-access/utilities-api.service';

import {
  UtilityRatesApiService
} from '../../data-access/utility-rates-api.service';

import {
  UtilityMetersApiService
} from '../../data-access/utility-meters-api.service';

import {
  MeterReadingsApiService
} from '../../data-access/meter-readings-api.service';

import {
  MeterReading
} from '../../models/meter-reading.model';

@Component({
  selector:
    'app-utility-billing-dashboard-page',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,
    TranslationPipe,
    LucideGauge,
    LucideZap,
    LucideBadgeDollarSign,
    LucideActivity,
    LucideBarChart3
  ],

  templateUrl:
    './utility-billing-dashboard.page.html',

  styleUrl:
    './utility-billing-dashboard.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class UtilityBillingDashboardPage {

  private readonly utilitiesApi =
    inject(UtilitiesApiService);

  private readonly ratesApi =
    inject(UtilityRatesApiService);

  private readonly metersApi =
    inject(UtilityMetersApiService);

  private readonly readingsApi =
    inject(MeterReadingsApiService);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly loading =
    signal(false);

  readonly utilitiesCount =
    signal(0);

  readonly ratesCount =
    signal(0);

  readonly metersCount =
    signal(0);

  readonly readings =
    signal<MeterReading[]>([]);

  readonly totalUsage =
    computed(
      () =>
        this.readings()
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
        this.readings()
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

  constructor() {
    this.load();
  }

  load(): void {

    this.loading.set(
      true
    );

    forkJoin({
      utilities:
        this.utilitiesApi.getAll({
          pageNumber:
            1,

          pageSize:
            1
        }),

      rates:
        this.ratesApi.getAll({
          pageNumber:
            1,

          pageSize:
            1
        }),

      meters:
        this.metersApi.getAll({
          pageNumber:
            1,

          pageSize:
            1
        }),

      readings:
        this.readingsApi.getAll({
          pageNumber:
            1,

          pageSize:
            100
        })
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
          result => {

            this.utilitiesCount.set(
              result.utilities.totalCount ??
              0
            );

            this.ratesCount.set(
              result.rates.totalCount ??
              0
            );

            this.metersCount.set(
              result.meters.totalCount ??
              0
            );

            this.readings.set(
              result.readings.items ??
              []
            );
          },

        error:
          error =>
            console.error(
              'Utility billing dashboard error',
              error
            )
      });
  }
}
