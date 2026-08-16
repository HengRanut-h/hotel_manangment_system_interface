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
  LucideBadgeDollarSign
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  MeterReadingsApiService
} from '../../data-access/meter-readings-api.service';

import {
  MeterReading
} from '../../models/meter-reading.model';

@Component({
  selector:
    'app-utility-billing-analytics-page',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,
    TranslationPipe,
    LucideArrowLeft,
    LucideBarChart3,
    LucideActivity,
    LucideBadgeDollarSign
  ],

  templateUrl:
    './utility-billing-analytics.page.html',

  styleUrl:
    './utility-billing-analytics.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class UtilityBillingAnalyticsPage {

  private readonly api =
    inject(MeterReadingsApiService);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly readings =
    signal<MeterReading[]>([]);

  readonly loading =
    signal(false);

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

  readonly averageUsage =
    computed(
      () =>
        this.readings().length
          ? this.totalUsage() /
            this.readings().length
          : 0
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
            this.readings.set(
              result.items ??
              []
            ),

        error:
          error =>
            console.error(
              'Utility analytics error',
              error
            )
      });
  }
}
