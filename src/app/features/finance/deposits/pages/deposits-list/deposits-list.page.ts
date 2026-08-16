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
  LucideCircleDollarSign,
  LucideCircleCheck,
  LucideClock3,
  LucideEye,
  LucideX,
  LucideLandmark
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  Deposit,
  DepositSortField,
  SortDirection
} from '../../models/deposit.model';

import {
  DepositsApiService
} from '../../data-access/deposits-api.service';

import {
  DepositStatusBadgeComponent
} from '../../components/deposit-status-badge/deposit-status-badge.component';

import {
  DepositTypeBadgeComponent
} from '../../components/deposit-type-badge/deposit-type-badge.component';

@Component({
  selector:
    'app-deposits-list-page',

  standalone:
    true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    TranslationPipe,

    DepositStatusBadgeComponent,
    DepositTypeBadgeComponent,

    LucideSearch,
    LucideRefreshCw,
    LucideBarChart3,
    LucideCircleDollarSign,
    LucideCircleCheck,
    LucideClock3,
    LucideEye,
    LucideX,
    LucideLandmark
  ],

  templateUrl:
    './deposits-list.page.html',

  styleUrl:
    './deposits-list.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class DepositsListPage {

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

  readonly search =
    signal('');

  readonly status =
    signal('');

  readonly depositType =
    signal('');

  readonly paymentMethod =
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
    signal<DepositSortField>(
      'receivedAtUtc'
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
        this.deposits()
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

  readonly receivedCount =
    computed(
      () =>
        this.deposits()
          .filter(
            item =>
              item.status ===
              'Received'
          )
          .length
    );

  readonly pendingCount =
    computed(
      () =>
        this.deposits()
          .filter(
            item =>
              item.status ===
              'Pending'
          )
          .length
    );

  constructor() {
    this.loadDeposits();
  }

  loadDeposits(): void {

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

        depositType:
          this.depositType(),

        paymentMethod:
          this.paymentMethod(),

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

            this.deposits.set(
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
              'Deposits API error',
              error
            );

            this.deposits.set(
              []
            );

            this.errorKey.set(
              'deposits.errors.loadList'
            );
          }
      });
  }

  searchDeposits(): void {

    this.pageNumber.set(
      1
    );

    this.loadDeposits();
  }

  filterChanged(): void {

    this.pageNumber.set(
      1
    );

    this.loadDeposits();
  }

  clearFilters(): void {

    this.search.set(
      ''
    );

    this.status.set(
      ''
    );

    this.depositType.set(
      ''
    );

    this.paymentMethod.set(
      ''
    );

    this.pageNumber.set(
      1
    );

    this.loadDeposits();
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

    this.loadDeposits();
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

    this.loadDeposits();
  }

  sort(
    field:
      DepositSortField
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

    this.loadDeposits();
  }

  sortIndicator(
    field:
      DepositSortField
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
