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
  LucideActivity,
  LucideSearch,
  LucidePlus,
  LucideRefreshCw,
  LucideBarChart3,
  LucideGauge,
  LucideTrendingUp,
  LucideCircleDollarSign,
  LucideEye,
  LucidePencil,
  LucideTrash2,
  LucideRotateCcw
} from '@lucide/angular';

import {
  MeterReading,
  MeterReadingSortField,
  SortDirection
} from '../../models/meter-reading.model';

import {
  MeterReadingsApiService
} from '../../data-access/meter-readings-api.service';

import {
  ReadingStatusBadgeComponent
} from '../../components/reading-status-badge/reading-status-badge.component';

import {
  UtilityTypeBadgeComponent
} from '../../components/utility-type-badge/utility-type-badge.component';

@Component({
  selector:
    'app-meter-readings-list-page',

  standalone:
    true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink,

    ReadingStatusBadgeComponent,
    UtilityTypeBadgeComponent,

    LucideActivity,
    LucideSearch,
    LucidePlus,
    LucideRefreshCw,
    LucideBarChart3,
    LucideGauge,
    LucideTrendingUp,
    LucideCircleDollarSign,
    LucideEye,
    LucidePencil,
    LucideTrash2,
    LucideRotateCcw
  ],

  templateUrl:
    './meter-readings-list.page.html',

  styleUrl:
    './meter-readings-list.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class MeterReadingsListPage {

  private readonly api =
    inject(MeterReadingsApiService);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly items =
    signal<MeterReading[]>([]);

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

  readonly fromDate =
    signal('');

  readonly toDate =
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
    signal<MeterReadingSortField>(
      'readingDateUtc'
    );

  readonly sortDirection =
    signal<SortDirection>(
      'desc'
    );

  readonly totalUsage =
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
                item.usage ||
                0
              ),

            0
          )
    );

  readonly totalAmount =
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
                item.amount ||
                0
              ),

            0
          )
    );

  readonly averageUsage =
    computed(() => {

      const rows =
        this.items();

      return rows.length
        ? this.totalUsage() /
          rows.length
        : 0;
    });

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

        fromUtc:
          this.fromDate()
            ? new Date(
                `${this.fromDate()}T00:00:00`
              ).toISOString()
            : undefined,

        toUtc:
          this.toDate()
            ? new Date(
                `${this.toDate()}T23:59:59`
              ).toISOString()
            : undefined,

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
              'Meter readings API error',
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

    this.fromDate.set(
      ''
    );

    this.toDate.set(
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
      MeterReadingSortField
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
      MeterReadingSortField
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

  deleteItem(
    item: MeterReading
  ): void {

    if (
      this.actionId()
    ) {
      return;
    }

    if (
      !window.confirm(
        `Delete reading for meter "${item.meterNumber || item.meterId}"?`
      )
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
              'Delete meter reading error',
              error
            )
      });
  }

  restoreItem(
    item: MeterReading
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
              'Restore meter reading error',
              error
            )
      });
  }
}
