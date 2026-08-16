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
  LucideCreditCard,
  LucideCircleDollarSign,
  LucideCircleCheck,
  LucideClock3,
  LucideCircleX,
  LucideBanknote,
  LucideLandmark,
  LucideSmartphone
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  Payment
} from '../../models/payment.model';

import {
  PaymentsApiService
} from '../../data-access/payments-api.service';

@Component({
  selector:
    'app-payments-analytics-page',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,
    TranslationPipe,

    LucideArrowLeft,
    LucideBarChart3,
    LucideCreditCard,
    LucideCircleDollarSign,
    LucideCircleCheck,
    LucideClock3,
    LucideCircleX,
    LucideBanknote,
    LucideLandmark,
    LucideSmartphone
  ],

  templateUrl:
    './payments-analytics.page.html',

  styleUrl:
    './payments-analytics.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class PaymentsAnalyticsPage {

  private readonly api =
    inject(PaymentsApiService);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly payments =
    signal<Payment[]>([]);

  readonly loading =
    signal(false);

  readonly errorKey =
    signal<string | null>(
      null
    );

  readonly totalPayments =
    computed(
      () =>
        this.payments().length
    );

  readonly totalAmount =
    computed(
      () =>
        this.payments()
          .reduce(
            (
              total,
              payment
            ) =>
              total +
              Number(
                payment.amount ||
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

  readonly failedCount =
    computed(
      () =>
        this.countByStatus(
          'Failed'
        )
    );

  readonly cashTotal =
    computed(
      () =>
        this.totalByMethod(
          'Cash'
        )
    );

  readonly cardTotal =
    computed(
      () =>
        this.totalByMethod(
          'Card'
        )
    );

  readonly bankTotal =
    computed(
      () =>
        this.totalByMethod(
          'BankTransfer'
        )
    );

  readonly mobileTotal =
    computed(
      () =>
        this.totalByMethod(
          'MobilePayment'
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
          'paidAtUtc',

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
            this.payments.set(
              result.items ??
              []
            ),

        error:
          error => {

            console.error(
              'Payment analytics API error',
              error
            );

            this.payments.set(
              []
            );

            this.errorKey.set(
              'payments.errors.loadAnalytics'
            );
          }
      });
  }

  private countByStatus(
    status: string
  ): number {

    return this.payments()
      .filter(
        payment =>
          payment.status ===
          status
      )
      .length;
  }

  private totalByMethod(
    method: string
  ): number {

    return this.payments()
      .filter(
        payment =>
          payment.method ===
          method
      )
      .reduce(
        (
          total,
          payment
        ) =>
          total +
          Number(
            payment.amount ||
            0
          ),

        0
      );
  }
}
