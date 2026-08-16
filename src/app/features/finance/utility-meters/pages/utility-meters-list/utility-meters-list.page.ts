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
  LucideGauge,
  LucideSearch,
  LucidePlus,
  LucideRefreshCw,
  LucideBarChart3,
  LucideCircleCheck,
  LucideCircleX,
  LucideActivity,
  LucideEye,
  LucidePencil,
  LucidePower,
  LucideTrash2,
  LucideRotateCcw
} from '@lucide/angular';

import {
  UtilityMeter,
  UtilityMeterSortField,
  SortDirection
} from '../../models/utility-meter.model';

import {
  UtilityMetersApiService
} from '../../data-access/utility-meters-api.service';

import {
  MeterStatusBadgeComponent
} from '../../components/meter-status-badge/meter-status-badge.component';

import {
  UtilityTypeBadgeComponent
} from '../../components/utility-type-badge/utility-type-badge.component';

@Component({
  selector:
    'app-utility-meters-list-page',

  standalone:
    true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink,

    MeterStatusBadgeComponent,
    UtilityTypeBadgeComponent,

    LucideGauge,
    LucideSearch,
    LucidePlus,
    LucideRefreshCw,
    LucideBarChart3,
    LucideCircleCheck,
    LucideCircleX,
    LucideActivity,
    LucideEye,
    LucidePencil,
    LucidePower,
    LucideTrash2,
    LucideRotateCcw
  ],

  templateUrl:
    './utility-meters-list.page.html',

  styleUrl:
    './utility-meters-list.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class UtilityMetersListPage {

  private readonly api =
    inject(UtilityMetersApiService);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly items =
    signal<UtilityMeter[]>([]);

  readonly loading =
    signal(false);

  readonly actionId =
    signal<string | null>(
      null
    );

  readonly error =
    signal(false);

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
    signal<UtilityMeterSortField>(
      'meterNumber'
    );

  readonly sortDirection =
    signal<SortDirection>(
      'asc'
    );

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

  readonly totalCurrentReading =
    computed(
      () =>
        this.items()
          .reduce(
            (
              total,
              item
            ) =>
              total +
              Number(
                item.currentReading ??
                item.initialReading ??
                0
              ),

            0
          )
    );

  constructor() {
    this.load();
  }

  load(): void {

    this.loading.set(
      true
    );

    this.error.set(
      false
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
              'Utility meters API error',
              error
            );

            this.items.set(
              []
            );

            this.error.set(
              true
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
      UtilityMeterSortField
  ): void {

    if (
      this.sortBy() ===
      field
    ) {
      this.sortDirection.update(
        value =>
          value === 'asc'
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
      UtilityMeterSortField
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
    item: UtilityMeter
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
          error =>
            console.error(
              'Toggle meter active error',
              error
            )
      });
  }

  deleteItem(
    item: UtilityMeter
  ): void {

    if (
      this.actionId()
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        `Delete meter "${item.meterNumber}"?`
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
          error =>
            console.error(
              'Delete meter error',
              error
            )
      });
  }

  restoreItem(
    item: UtilityMeter
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
          error =>
            console.error(
              'Restore meter error',
              error
            )
      });
  }
}
