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
  FormsModule
} from '@angular/forms';

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
  LucideSearch,
  LucideRefreshCw,
  LucideBarChart3,
  LucideCreditCard,
  LucideCircleDollarSign,
  LucideCircleCheck,
  LucideClock3,
  LucideEye,
  LucideX
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  Payment,
  PaymentSortField,
  SortDirection
} from '../../models/payment.model';

import {
  PaymentsApiService
} from '../../data-access/payments-api.service';

import {
  PaymentMethodBadgeComponent
} from '../../components/payment-method-badge/payment-method-badge.component';

import {
  PaymentStatusBadgeComponent
} from '../../components/payment-status-badge/payment-status-badge.component';

@Component({
  selector:
    'app-payments-list-page',

  standalone:
    true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    TranslationPipe,

    PaymentMethodBadgeComponent,
    PaymentStatusBadgeComponent,

    LucideSearch,
    LucideRefreshCw,
    LucideBarChart3,
    LucideCreditCard,
    LucideCircleDollarSign,
    LucideCircleCheck,
    LucideClock3,
    LucideEye,
    LucideX
  ],

  templateUrl:
    './payments-list.page.html',

  styleUrl:
    './payments-list.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class PaymentsListPage {

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

  readonly search =
    signal('');

  readonly status =
    signal('');

  readonly method =
    signal('');

  readonly pageNumber =
    signal(1);

  readonly pageSize =
    signal(20);

  readonly totalCount =
    signal(0);

  readonly totalPages =
    signal(1);

  readonly sortBy =
    signal<PaymentSortField>(
      'paidAtUtc'
    );

  readonly sortDirection =
    signal<SortDirection>(
      'desc'
    );

  readonly pageNumbers =
    computed(() => {

      const total =
        this.totalPages();

      const current =
        this.pageNumber();

      const start =
        Math.max(
          1,
          current - 2
        );

      const end =
        Math.min(
          total,
          current + 2
        );

      return Array.from(
        {
          length:
            Math.max(
              0,
              end - start + 1
            )
        },

        (
          _,
          index
        ) =>
          start + index
      );
    });

  readonly pageAmount =
    computed(
      () =>
        this.payments()
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

  readonly completedCount =
    computed(
      () =>
        this.payments()
          .filter(
            item =>
              item.status ===
              'Completed'
          )
          .length
    );

  readonly pendingCount =
    computed(
      () =>
        this.payments()
          .filter(
            item =>
              item.status ===
              'Pending'
          )
          .length
    );

  constructor() {
    this.loadPayments();
  }

  loadPayments(): void {

    this.loading.set(
      true
    );

    this.errorKey.set(
      null
    );

    this.api
      .getAll({
        pageNumber:
          this.pageNumber(),

        pageSize:
          this.pageSize(),

        search:
          this.search(),

        status:
          this.status(),

        method:
          this.method(),

        sortBy:
          this.sortBy(),

        sortDirection:
          this.sortDirection()
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

            this.payments.set(
              result.items ??
              []
            );

            this.totalCount.set(
              result.totalCount ??
              0
            );

            this.totalPages.set(
              Math.max(
                1,

                result.totalPages ??
                Math.ceil(
                  (
                    result.totalCount ??
                    0
                  )
                  /
                  (
                    result.pageSize ||
                    this.pageSize()
                  )
                )
              )
            );
          },

        error:
          error => {

            console.error(
              'Payments API error',
              error
            );

            this.payments.set(
              []
            );

            this.errorKey.set(
              'payments.errors.loadList'
            );
          }
      });
  }

  searchPayments(): void {

    this.pageNumber.set(
      1
    );

    this.loadPayments();
  }

  filterChanged(): void {

    this.pageNumber.set(
      1
    );

    this.loadPayments();
  }

  clearFilters(): void {

    this.search.set(
      ''
    );

    this.status.set(
      ''
    );

    this.method.set(
      ''
    );

    this.pageNumber.set(
      1
    );

    this.loadPayments();
  }

  changePage(
    page: number
  ): void {

    if (
      page < 1 ||
      page >
        this.totalPages() ||
      page ===
        this.pageNumber()
    ) {
      return;
    }

    this.pageNumber.set(
      page
    );

    this.loadPayments();
  }

  changePageSize(
    value:
      number | string
  ): void {

    this.pageSize.set(
      Number(
        value
      )
    );

    this.pageNumber.set(
      1
    );

    this.loadPayments();
  }

  sort(
    field:
      PaymentSortField
  ): void {

    if (
      this.sortBy() ===
      field
    ) {

      this.sortDirection.update(
        direction =>
          direction ===
          'asc'
            ? 'desc'
            : 'asc'
      );

    } else {

      this.sortBy.set(
        field
      );

      this.sortDirection.set(
        'asc'
      );
    }

    this.loadPayments();
  }

  sortIndicator(
    field:
      PaymentSortField
  ): string {

    if (
      this.sortBy() !==
      field
    ) {
      return '';
    }

    return this.sortDirection() ===
      'asc'
        ? '↑'
        : '↓';
  }
}
