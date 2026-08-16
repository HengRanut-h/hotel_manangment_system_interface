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
  LucideBadgeDollarSign,
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
  SortDirection,
  UtilityRate,
  UtilityRateSortField
} from '../../models/utility-rate.model';

import {
  UtilityRatesApiService
} from '../../data-access/utility-rates-api.service';

import {
  UtilityRateStatusBadgeComponent
} from '../../components/utility-rate-status-badge/utility-rate-status-badge.component';

import {
  UtilityTypeBadgeComponent
} from '../../components/utility-type-badge/utility-type-badge.component';

@Component({
  selector:
    'app-utility-rates-list-page',

  standalone:
    true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    TranslationPipe,

    UtilityRateStatusBadgeComponent,
    UtilityTypeBadgeComponent,

    LucideSearch,
    LucideRefreshCw,
    LucideBarChart3,
    LucideBadgeDollarSign,
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
    './utility-rates-list.page.html',

  styleUrl:
    './utility-rates-list.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class UtilityRatesListPage {

  private readonly api =
    inject(UtilityRatesApiService);

  private readonly translate =
    inject(TranslationService);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly items =
    signal<UtilityRate[]>([]);

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

  readonly utilityType =
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
    signal<UtilityRateSortField>(
      'effectiveFromUtc'
    );

  readonly sortDirection =
    signal<SortDirection>(
      'desc'
    );

  readonly averageRate =
    computed(() => {

      const rows =
        this.items();

      if (
        rows.length ===
        0
      ) {
        return 0;
      }

      return rows
        .reduce(
          (
            total,
            item
          ) =>
            total +
            Number(
              item.ratePerUnit ||
              0
            ),

          0
        )
        /
        rows.length;
    });

  readonly activeCount =
    computed(
      () =>
        this.items()
          .filter(
            item =>
              item.isActive &&
              !item.isDeleted
          )
          .length
    );

  readonly inactiveCount =
    computed(
      () =>
        this.items()
          .filter(
            item =>
              !item.isActive &&
              !item.isDeleted
          )
          .length
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

        utilityType:
          this.utilityType(),

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

            this.items.set(
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
              'Utility rate list API error',
              error
            );

            this.items.set(
              []
            );

            this.errorKey.set(
              'utilityRates.errors.loadList'
            );
          }
      });
  }

  searchNow(): void {

    this.pageNumber.set(
      1
    );

    this.load();
  }

  filterChanged(): void {

    this.pageNumber.set(
      1
    );

    this.load();
  }

  clearFilters(): void {

    this.search.set(
      ''
    );

    this.utilityType.set(
      ''
    );

    this.activeFilter.set(
      ''
    );

    this.pageNumber.set(
      1
    );

    this.load();
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

    this.load();
  }

  sort(
    field:
      UtilityRateSortField
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

    this.load();
  }

  sortIndicator(
    field:
      UtilityRateSortField
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
    item: UtilityRate
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
            this.load(),

        error:
          error => {

            console.error(
              'Toggle utility rate active error',
              error
            );

            this.errorKey.set(
              'utilityRates.errors.toggleActive'
            );
          }
      });
  }

  deleteItem(
    item: UtilityRate
  ): void {

    if (
      this.actionId()
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        this.translate.translate(
          'utilityRates.delete.confirm',
          {
            name:
              item.name ||
              item.utilityName ||
              item.id
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
            this.load(),

        error:
          error => {

            console.error(
              'Delete utility rate error',
              error
            );

            this.errorKey.set(
              'utilityRates.errors.delete'
            );
          }
      });
  }

  restoreItem(
    item: UtilityRate
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
            this.load(),

        error:
          error => {

            console.error(
              'Restore utility rate error',
              error
            );

            this.errorKey.set(
              'utilityRates.errors.restore'
            );
          }
      });
  }
}
