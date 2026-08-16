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
  LucideRotateCcw,
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
  Refund,
  RefundSortField,
  SortDirection
} from '../../models/refund.model';

import {
  RefundsApiService
} from '../../data-access/refunds-api.service';

import {
  RefundStatusBadgeComponent
} from '../../components/refund-status-badge/refund-status-badge.component';

import {
  RefundReasonBadgeComponent
} from '../../components/refund-reason-badge/refund-reason-badge.component';

@Component({
  selector:
    'app-refunds-list-page',

  standalone:
    true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    TranslationPipe,

    RefundStatusBadgeComponent,
    RefundReasonBadgeComponent,

    LucideSearch,
    LucideRefreshCw,
    LucideBarChart3,
    LucideRotateCcw,
    LucideCircleDollarSign,
    LucideCircleCheck,
    LucideClock3,
    LucideEye,
    LucideX
  ],

  templateUrl:
    './refunds-list.page.html',

  styleUrl:
    './refunds-list.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class RefundsListPage {

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

  readonly search =
    signal('');

  readonly status =
    signal('');

  readonly reason =
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
    signal<RefundSortField>(
      'requestedAtUtc'
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
        this.refunds()
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
        this.refunds()
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
        this.refunds()
          .filter(
            item =>
              item.status ===
              'Pending'
          )
          .length
    );

  constructor() {
    this.loadRefunds();
  }

  loadRefunds(): void {

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

        reason:
          this.reason(),

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

            this.refunds.set(
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
              'Refunds API error',
              error
            );

            this.refunds.set(
              []
            );

            this.errorKey.set(
              'refunds.errors.loadList'
            );
          }
      });
  }

  searchRefunds(): void {

    this.pageNumber.set(
      1
    );

    this.loadRefunds();
  }

  filterChanged(): void {

    this.pageNumber.set(
      1
    );

    this.loadRefunds();
  }

  clearFilters(): void {

    this.search.set(
      ''
    );

    this.status.set(
      ''
    );

    this.reason.set(
      ''
    );

    this.method.set(
      ''
    );

    this.pageNumber.set(
      1
    );

    this.loadRefunds();
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

    this.loadRefunds();
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

    this.loadRefunds();
  }

  sort(
    field:
      RefundSortField
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

    this.loadRefunds();
  }

  sortIndicator(
    field:
      RefundSortField
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
