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
  LucideBadgePercent,
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
  Tax,
  TaxSortField,
  SortDirection
} from '../../models/tax.model';

import {
  TaxesApiService
} from '../../data-access/taxes-api.service';

import {
  TaxStatusBadgeComponent
} from '../../components/tax-status-badge/tax-status-badge.component';

import {
  TaxTypeBadgeComponent
} from '../../components/tax-type-badge/tax-type-badge.component';

@Component({
  selector:
    'app-taxes-list-page',

  standalone:
    true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    TranslationPipe,
    TaxStatusBadgeComponent,
    TaxTypeBadgeComponent,
    LucideSearch,
    LucideRefreshCw,
    LucideBarChart3,
    LucideBadgePercent,
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
    './taxes-list.page.html',

  styleUrl:
    './taxes-list.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class TaxesListPage {

  private readonly api =
    inject(TaxesApiService);

  private readonly translate =
    inject(TranslationService);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly taxes =
    signal<Tax[]>([]);

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
    signal<TaxSortField>(
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

  readonly averageRate =
    computed(() => {

      const items =
        this.taxes();

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
              item.rate ||
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
        this.taxes()
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
        this.taxes()
          .filter(
            item =>
              item.isActive !==
              true &&
              !item.isDeleted
          )
          .length
    );

  constructor() {
    this.loadTaxes();
  }

  loadTaxes(): void {

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

            this.taxes.set(
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
              'Tax list API error',
              error
            );

            this.taxes.set(
              []
            );

            this.errorKey.set(
              'taxes.errors.loadList'
            );
          }
      });
  }

  searchTaxes(): void {

    this.pageNumber.set(
      1
    );

    this.loadTaxes();
  }

  filterChanged(): void {

    this.pageNumber.set(
      1
    );

    this.loadTaxes();
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

    this.loadTaxes();
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

    this.loadTaxes();
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

    this.loadTaxes();
  }

  sort(
    field:
      TaxSortField
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

    this.loadTaxes();
  }

  sortIndicator(
    field:
      TaxSortField
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
    item: Tax
  ): void {

    if (
      item.isDeleted ||
      this.actionId()
    ) {
      return;
    }

    this.actionId.set(
      item.id
    );

    this.api
      .setActive(
        item.id,
        !item.isActive
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
            this.loadTaxes(),

        error:
          error => {

            console.error(
              'Toggle tax active error',
              error
            );

            this.errorKey.set(
              'taxes.errors.toggleActive'
            );
          }
      });
  }

  deleteTax(
    item: Tax
  ): void {

    if (
      this.actionId()
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        this.translate.translate(
          'taxes.delete.confirm',
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
            this.loadTaxes(),

        error:
          error => {

            console.error(
              'Delete tax API error',
              error
            );

            this.errorKey.set(
              'taxes.errors.delete'
            );
          }
      });
  }

  restoreTax(
    item: Tax
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
            this.loadTaxes(),

        error:
          error => {

            console.error(
              'Restore tax API error',
              error
            );

            this.errorKey.set(
              'taxes.errors.restore'
            );
          }
      });
  }
}
