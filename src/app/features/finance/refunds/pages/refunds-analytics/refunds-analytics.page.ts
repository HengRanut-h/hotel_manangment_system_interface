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
  LucideRotateCcw,
  LucideCircleDollarSign,
  LucideCircleCheck,
  LucideClock3,
  LucideCircleX,
  LucideCalendarX2,
  LucideCopy,
  LucideMessageSquareWarning,
  LucideLandmark
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  Refund
} from '../../models/refund.model';

import {
  RefundsApiService
} from '../../data-access/refunds-api.service';

@Component({
  selector:
    'app-refunds-analytics-page',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,
    TranslationPipe,

    LucideArrowLeft,
    LucideBarChart3,
    LucideRotateCcw,
    LucideCircleDollarSign,
    LucideCircleCheck,
    LucideClock3,
    LucideCircleX,
    LucideCalendarX2,
    LucideCopy,
    LucideMessageSquareWarning,
    LucideLandmark
  ],

  templateUrl:
    './refunds-analytics.page.html',

  styleUrl:
    './refunds-analytics.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class RefundsAnalyticsPage {

  private readonly api =
    inject(RefundsApiService);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly refunds =
    signal<Refund[]>([]);

  readonly loading =
    signal(false);

  readonly errorKey =
    signal<string | null>(
      null
    );

  readonly totalRefunds =
    computed(
      () =>
        this.refunds().length
    );

  readonly totalAmount =
    computed(
      () =>
        this.refunds()
          .reduce(
            (
              total,
              refund
            ) =>
              total +
              Number(
                refund.amount ||
                0
              ),

            0
          )
    );

  readonly completedCount =
    computed(
      () =>
        this.countByStatus(
          'Completed'
        )
    );

  readonly pendingCount =
    computed(
      () =>
        this.countByStatus(
          'Pending'
        )
    );

  readonly rejectedCount =
    computed(
      () =>
        this.countByStatus(
          'Rejected'
        )
    );

  readonly cancellationTotal =
    computed(
      () =>
        this.totalByReason(
          'Cancellation'
        )
    );

  readonly overpaymentTotal =
    computed(
      () =>
        this.totalByReason(
          'Overpayment'
        )
    );

  readonly duplicatePaymentTotal =
    computed(
      () =>
        this.totalByReason(
          'DuplicatePayment'
        )
    );

  readonly serviceIssueTotal =
    computed(
      () =>
        this.totalByReason(
          'ServiceIssue'
        )
    );

  readonly depositReturnTotal =
    computed(
      () =>
        this.totalByReason(
          'DepositReturn'
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
          'requestedAtUtc',

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
            this.refunds.set(
              result.items ??
              []
            ),

        error:
          error => {

            console.error(
              'Refund analytics API error',
              error
            );

            this.refunds.set(
              []
            );

            this.errorKey.set(
              'refunds.errors.loadAnalytics'
            );
          }
      });
  }

  private countByStatus(
    status: string
  ): number {

    return this.refunds()
      .filter(
        refund =>
          refund.status ===
          status
      )
      .length;
  }

  private totalByReason(
    reason: string
  ): number {

    return this.refunds()
      .filter(
        refund =>
          refund.reason ===
          reason
      )
      .reduce(
        (
          total,
          refund
        ) =>
          total +
          Number(
            refund.amount ||
            0
          ),

        0
      );
  }
}
