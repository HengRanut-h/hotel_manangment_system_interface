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
  LucideLandmark,
  LucideCircleDollarSign,
  LucideCircleCheck,
  LucideClock3,
  LucideRotateCcw,
  LucideShieldCheck,
  LucideTriangleAlert
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  Deposit
} from '../../models/deposit.model';

import {
  DepositsApiService
} from '../../data-access/deposits-api.service';

@Component({
  selector:
    'app-deposits-analytics-page',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,
    TranslationPipe,

    LucideArrowLeft,
    LucideBarChart3,
    LucideLandmark,
    LucideCircleDollarSign,
    LucideCircleCheck,
    LucideClock3,
    LucideRotateCcw,
    LucideShieldCheck,
    LucideTriangleAlert
  ],

  templateUrl:
    './deposits-analytics.page.html',

  styleUrl:
    './deposits-analytics.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class DepositsAnalyticsPage {

  private readonly api =
    inject(DepositsApiService);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly deposits =
    signal<Deposit[]>([]);

  readonly loading =
    signal(false);

  readonly errorKey =
    signal<string | null>(
      null
    );

  readonly totalDeposits =
    computed(
      () =>
        this.deposits().length
    );

  readonly totalAmount =
    computed(
      () =>
        this.deposits()
          .reduce(
            (
              total,
              deposit
            ) =>
              total +
              Number(
                deposit.amount ||
                0
              ),

            0
          )
    );

  readonly receivedCount =
    computed(
      () =>
        this.countByStatus(
          'Received'
        )
    );

  readonly pendingCount =
    computed(
      () =>
        this.countByStatus(
          'Pending'
        )
    );

  readonly refundedCount =
    computed(
      () =>
        this.countByStatus(
          'Refunded'
        )
    );

  readonly reservationTotal =
    computed(
      () =>
        this.totalByType(
          'Reservation'
        )
    );

  readonly securityTotal =
    computed(
      () =>
        this.totalByType(
          'Security'
        )
    );

  readonly advanceTotal =
    computed(
      () =>
        this.totalByType(
          'Advance'
        )
    );

  readonly damageTotal =
    computed(
      () =>
        this.totalByType(
          'Damage'
        )
    );

  constructor() {
    this.load();
  }

  load(): void {

    this.loading.set(
      true
    );

    this.errorKey.set(
      null
    );

    this.api
      .getAll({
        pageNumber:
          1,

        pageSize:
          1000,

        sortBy:
          'receivedAtUtc',

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
            this.deposits.set(
              result.items ??
              []
            ),

        error:
          error => {

            console.error(
              'Deposit analytics API error',
              error
            );

            this.deposits.set(
              []
            );

            this.errorKey.set(
              'deposits.errors.loadAnalytics'
            );
          }
      });
  }

  private countByStatus(
    status: string
  ): number {

    return this.deposits()
      .filter(
        deposit =>
          deposit.status ===
          status
      )
      .length;
  }

  private totalByType(
    type: string
  ): number {

    return this.deposits()
      .filter(
        deposit =>
          deposit.depositType ===
          type
      )
      .reduce(
        (
          total,
          deposit
        ) =>
          total +
          Number(
            deposit.amount ||
            0
          ),

        0
      );
  }
}
