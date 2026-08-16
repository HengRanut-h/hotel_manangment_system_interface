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
  LucideFlag,
  LucideSearch,
  LucideRefreshCw,
  LucidePlus,
  LucideBarChart3,
  LucideToggleRight,
  LucideToggleLeft,
  LucideGauge,
  LucideLayers3,
  LucideEye,
  LucidePencil,
  LucidePower,
  LucideTrash2,
  LucideRotateCcw
} from '@lucide/angular';

import {
  FeatureFlag,
  FeatureFlagSortField,
  SortDirection
} from '../../models/feature-flag.model';

import {
  FeatureFlagsApiService
} from '../../data-access/feature-flags-api.service';

import {
  FeatureFlagStatusBadgeComponent
} from '../../components/feature-flag-status-badge/feature-flag-status-badge.component';

import {
  EnvironmentBadgeComponent
} from '../../components/environment-badge/environment-badge.component';

@Component({
  selector:
    'app-feature-flags-list-page',

  standalone:
    true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink,

    FeatureFlagStatusBadgeComponent,
    EnvironmentBadgeComponent,

    LucideFlag,
    LucideSearch,
    LucideRefreshCw,
    LucidePlus,
    LucideBarChart3,
    LucideToggleRight,
    LucideGauge,
    LucideLayers3,
    LucideEye,
    LucidePencil,
    LucidePower,
    LucideTrash2,
    LucideRotateCcw
  ],

  templateUrl:
    './feature-flags-list.page.html',

  styleUrl:
    './feature-flags-list.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class FeatureFlagsListPage {

  private readonly api =
    inject(FeatureFlagsApiService);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly items =
    signal<FeatureFlag[]>([]);

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

  readonly environment =
    signal('');

  readonly enabledFilter =
    signal('');

  readonly includeDeleted =
    signal(false);

  readonly pageNumber =
    signal(1);

  readonly pageSize =
    signal(20);

  readonly totalCount =
    signal(0);

  readonly totalPages =
    signal(1);

  readonly sortBy =
    signal<FeatureFlagSortField>(
      'name'
    );

  readonly sortDirection =
    signal<SortDirection>(
      'asc'
    );

  readonly enabledCount =
    computed(
      () =>
        this.items()
          .filter(
            item =>
              item.isEnabled &&
              !item.isDeleted
          )
          .length
    );

  readonly disabledCount =
    computed(
      () =>
        this.items()
          .filter(
            item =>
              !item.isEnabled &&
              !item.isDeleted
          )
          .length
    );

  readonly averageRollout =
    computed(() => {

      const rows =
        this.items()
          .filter(
            item =>
              !item.isDeleted
          );

      if (
        rows.length === 0
      ) {
        return 0;
      }

      return rows.reduce(
        (
          total,
          item
        ) =>
          total +
          Number(
            item.rolloutPercentage ??
            100
          ),
        0
      ) / rows.length;
    });

  readonly environmentCount =
    computed(
      () =>
        new Set(
          this.items()
            .map(
              item =>
                item.environment ||
                'All'
            )
        ).size
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

    const enabled =
      this.enabledFilter();

    this.api
      .getAll({
        pageNumber:
          this.pageNumber(),

        pageSize:
          this.pageSize(),

        search:
          this.search(),

        environment:
          this.environment(),

        isEnabled:
          enabled === ''
            ? undefined
            : enabled === 'true',

        includeDeleted:
          this.includeDeleted(),

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
              'Feature flags API error',
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

    this.environment.set(
      ''
    );

    this.enabledFilter.set(
      ''
    );

    this.includeDeleted.set(
      false
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
      page > this.totalPages()
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
      FeatureFlagSortField
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
      FeatureFlagSortField
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

  toggleEnabled(
    item: FeatureFlag
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
      .setEnabled(
        item.id,
        !item.isEnabled
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
              'Toggle feature flag error',
              error
            )
      });
  }

  deleteItem(
    item: FeatureFlag
  ): void {

    if (
      this.actionId()
    ) {
      return;
    }

    if (
      !window.confirm(
        `Delete feature flag "${item.name}"?`
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
              'Delete feature flag error',
              error
            )
      });
  }

  restoreItem(
    item: FeatureFlag
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
              'Restore feature flag error',
              error
            )
      });
  }
}
