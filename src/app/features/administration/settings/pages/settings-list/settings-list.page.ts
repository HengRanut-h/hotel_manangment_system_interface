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
  LucideSettings,
  LucideSearch,
  LucideRefreshCw,
  LucidePlus,
  LucideBarChart3,
  LucideCircleCheck,
  LucideLockKeyhole,
  LucideShieldCheck,
  LucideLayers3,
  LucideEye,
  LucidePencil,
  LucidePower,
  LucideTrash2,
  LucideRotateCcw
} from '@lucide/angular';

import {
  SettingItem,
  SettingSortField,
  SortDirection
} from '../../models/setting.model';

import {
  SettingsApiService
} from '../../data-access/settings-api.service';

import {
  SettingStatusBadgeComponent
} from '../../components/setting-status-badge/setting-status-badge.component';

import {
  SettingTypeBadgeComponent
} from '../../components/setting-type-badge/setting-type-badge.component';

@Component({
  selector:
    'app-settings-list-page',

  standalone:
    true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink,

    SettingStatusBadgeComponent,
    SettingTypeBadgeComponent,

    LucideSettings,
    LucideSearch,
    LucideRefreshCw,
    LucidePlus,
    LucideBarChart3,
    LucideCircleCheck,
    LucideLockKeyhole,
    LucideLayers3,
    LucideEye,
    LucidePencil,
    LucidePower,
    LucideTrash2,
    LucideRotateCcw
  ],

  templateUrl:
    './settings-list.page.html',

  styleUrl:
    './settings-list.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class SettingsListPage {

  private readonly api =
    inject(SettingsApiService);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly items =
    signal<SettingItem[]>([]);

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

  readonly category =
    signal('');

  readonly valueType =
    signal('');

  readonly activeFilter =
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
    signal<SettingSortField>(
      'name'
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

  readonly sensitiveCount =
    computed(
      () =>
        this.items()
          .filter(
            item =>
              item.isSensitive
          )
          .length
    );

  readonly systemCount =
    computed(
      () =>
        this.items()
          .filter(
            item =>
              item.isSystem
          )
          .length
    );

  readonly categoryCount =
    computed(
      () =>
        new Set(
          this.items()
            .map(
              item =>
                item.category ||
                'General'
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

        category:
          this.category(),

        valueType:
          this.valueType(),

        isActive:
          active === ''
            ? undefined
            : active === 'true',

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
              'Settings API error',
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

    this.category.set(
      ''
    );

    this.valueType.set(
      ''
    );

    this.activeFilter.set(
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
      SettingSortField
  ): void {

    if (
      this.sortBy() === field
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
      SettingSortField
  ): string {

    if (
      this.sortBy() !== field
    ) {
      return '';
    }

    return this.sortDirection() ===
      'asc'
        ? '↑'
        : '↓';
  }

  displayValue(
    item: SettingItem
  ): string {

    if (
      item.isSensitive
    ) {
      return '••••••••';
    }

    const value =
      item.value ??
      item.defaultValue ??
      '—';

    if (
      item.valueType === 'Json' &&
      value !== '—'
    ) {
      return '[JSON]';
    }

    return value;
  }

  toggleActive(
    item: SettingItem
  ): void {

    if (
      item.isDeleted ||
      item.isReadOnly ||
      this.actionId()
    ) {
      return;
    }

    this.runAction(
      item.id,
      this.api.setActive(
        item.id,
        !item.isActive
      )
    );
  }

  deleteItem(
    item: SettingItem
  ): void {

    if (
      item.isReadOnly ||
      item.isSystem ||
      this.actionId()
    ) {
      return;
    }

    if (
      !window.confirm(
        `Delete setting "${item.name}"?`
      )
    ) {
      return;
    }

    this.runAction(
      item.id,
      this.api.delete(
        item.id
      )
    );
  }

  restoreItem(
    item: SettingItem
  ): void {

    this.runAction(
      item.id,
      this.api.restore(
        item.id
      )
    );
  }

  private runAction(
    id: string,
    request:
      import('rxjs').Observable<unknown>
  ): void {

    if (
      this.actionId()
    ) {
      return;
    }

    this.actionId.set(
      id
    );

    request
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
              'Setting action error',
              error
            )
      });
  }
}
