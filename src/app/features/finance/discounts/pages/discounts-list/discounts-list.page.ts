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
  LucideTicketPercent,
  LucideCircleDollarSign,
  LucideCircleCheck,
  LucideCircleX,
  LucideEye,
  LucidePencil,
  LucideTrash2,
  LucidePower,
  LucideRotateCcw,
  LucidePlus,
  LucideX
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  TranslationService
} from '../../../../../core/i18n/translation.service';

import {
  Discount,
  DiscountSortField,
  SortDirection
} from '../../models/discount.model';

import {
  DiscountsApiService
} from '../../data-access/discounts-api.service';

import {
  DiscountStatusBadgeComponent
} from '../../components/discount-status-badge/discount-status-badge.component';

import {
  DiscountTypeBadgeComponent
} from '../../components/discount-type-badge/discount-type-badge.component';

@Component({
  selector:
    'app-discounts-list-page',

  standalone:
    true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    TranslationPipe,
    DiscountStatusBadgeComponent,
    DiscountTypeBadgeComponent,
    LucideSearch,
    LucideRefreshCw,
    LucideBarChart3,
    LucideTicketPercent,
    LucideCircleDollarSign,
    LucideCircleCheck,
    LucideCircleX,
    LucideEye,
    LucidePencil,
    LucideTrash2,
    LucidePower,
    LucideRotateCcw,
    LucidePlus,
    LucideX
  ],

  templateUrl:
    './discounts-list.page.html',

  styleUrl:
    './discounts-list.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class DiscountsListPage {

  private readonly api =
    inject(DiscountsApiService);

  private readonly translate =
    inject(TranslationService);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly discounts =
    signal<Discount[]>([]);

  readonly loading =
    signal(false);

  readonly actionId =
    signal<string | null>(
      null
    );

  readonly errorKey =
    signal<string | null>(
      null
    );

  readonly search =
    signal('');

  readonly type =
    signal('');

  readonly activeFilter =
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
    signal<DiscountSortField>(
      'name'
    );

  readonly sortDirection =
    signal<SortDirection>(
      'asc'
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

  readonly averageValue =
    computed(() => {

      const items =
        this.discounts();

      if (
        items.length ===
        0
      ) {
        return 0;
      }

      return items
        .reduce(
          (
            total,
            item
          ) =>
            total +
            Number(
              item.value ||
              0
            ),

          0
        )
        /
        items.length;
    });

  readonly activeCount =
    computed(
      () =>
        this.discounts()
          .filter(
            item =>
              item.isActive ===
              true &&
              !item.isDeleted
          )
          .length
    );

  readonly inactiveCount =
    computed(
      () =>
        this.discounts()
          .filter(
            item =>
              item.isActive !==
              true &&
              !item.isDeleted
          )
          .length
    );

  constructor() {
    this.loadDiscounts();
  }

  loadDiscounts(): void {

    this.loading.set(
      true
    );

    this.errorKey.set(
      null
    );

    const active =
      this.activeFilter();

    this.api
      .getAll({
        pageNumber:
          this.pageNumber(),

        pageSize:
          this.pageSize(),

        search:
          this.search(),

        type:
          this.type(),

        isActive:
          active === ''
            ? undefined
            : active === 'true',

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

            this.discounts.set(
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
                1
              )
            );
          },

        error:
          error => {

            console.error(
              'Discount list API error',
              error
            );

            this.discounts.set(
              []
            );

            this.errorKey.set(
              'discounts.errors.loadList'
            );
          }
      });
  }

  searchDiscounts(): void {

    this.pageNumber.set(
      1
    );

    this.loadDiscounts();
  }

  filterChanged(): void {

    this.pageNumber.set(
      1
    );

    this.loadDiscounts();
  }

  clearFilters(): void {

    this.search.set(
      ''
    );

    this.type.set(
      ''
    );

    this.activeFilter.set(
      ''
    );

    this.pageNumber.set(
      1
    );

    this.loadDiscounts();
  }

  changePage(
    page: number
  ): void {

    if (
      page < 1 ||
      page >
        this.totalPages()
    ) {
      return;
    }

    this.pageNumber.set(
      page
    );

    this.loadDiscounts();
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

    this.loadDiscounts();
  }

  sort(
    field:
      DiscountSortField
  ): void {

    if (
      this.sortBy() ===
      field
    ) {
      this.sortDirection.update(
        value =>
          value ===
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

    this.loadDiscounts();
  }

  sortIndicator(
    field:
      DiscountSortField
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

  toggleActive(
    item: Discount
  ): void {

    if (
      item.isDeleted ||
      this.actionId()
    ) {
      return;
    }

    const nextActive =
      !item.isActive;

    this.actionId.set(
      item.id
    );

    this.api
      .setActive(
        item.id,
        nextActive
      )
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        ),

        finalize(
          () =>
            this.actionId.set(
              null
            )
        )
      )
      .subscribe({
        next:
          () =>
            this.loadDiscounts(),

        error:
          error => {

            console.error(
              'Toggle active API error',
              error
            );

            this.errorKey.set(
              'discounts.errors.toggleActive'
            );
          }
      });
  }

  deleteDiscount(
    item: Discount
  ): void {

    if (
      this.actionId()
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        this.translate.translate(
          'discounts.delete.confirm',
          {
            name:
              item.name
          }
        )
      );

    if (
      !confirmed
    ) {
      return;
    }

    this.actionId.set(
      item.id
    );

    this.api
      .delete(
        item.id
      )
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        ),

        finalize(
          () =>
            this.actionId.set(
              null
            )
        )
      )
      .subscribe({
        next:
          () =>
            this.loadDiscounts(),

        error:
          error => {

            console.error(
              'Delete discount API error',
              error
            );

            this.errorKey.set(
              'discounts.errors.delete'
            );
          }
      });
  }

  restoreDiscount(
    item: Discount
  ): void {

    if (
      this.actionId()
    ) {
      return;
    }

    this.actionId.set(
      item.id
    );

    this.api
      .restore(
        item.id
      )
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        ),

        finalize(
          () =>
            this.actionId.set(
              null
            )
        )
      )
      .subscribe({
        next:
          () =>
            this.loadDiscounts(),

        error:
          error => {

            console.error(
              'Restore discount API error',
              error
            );

            this.errorKey.set(
              'discounts.errors.restore'
            );
          }
      });
  }
}
