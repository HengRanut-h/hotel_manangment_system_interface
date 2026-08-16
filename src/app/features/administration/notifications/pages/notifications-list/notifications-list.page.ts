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
  LucideBell,
  LucideSearch,
  LucideRefreshCw,
  LucideBarChart3,
  LucideMail,
  LucideMailOpen,
  LucideArchive,
  LucideTrash2,
  LucideEye,
  LucideRotateCcw,
  LucideCheckCheck
} from '@lucide/angular';

import {
  NotificationItem,
  NotificationSortField,
  SortDirection
} from '../../models/notification.model';

import {
  NotificationsApiService
} from '../../data-access/notifications-api.service';

import {
  NotificationTypeBadgeComponent
} from '../../components/notification-type-badge/notification-type-badge.component';

import {
  NotificationPriorityBadgeComponent
} from '../../components/notification-priority-badge/notification-priority-badge.component';

@Component({
  selector:
    'app-notifications-list-page',

  standalone:
    true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink,

    NotificationTypeBadgeComponent,
    NotificationPriorityBadgeComponent,

    LucideBell,
    LucideSearch,
    LucideRefreshCw,
    LucideBarChart3,
    LucideMail,
    LucideMailOpen,
    LucideArchive,
    LucideTrash2,
    LucideEye,
    LucideRotateCcw,
    LucideCheckCheck
  ],

  templateUrl:
    './notifications-list.page.html',

  styleUrl:
    './notifications-list.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class NotificationsListPage {

  private readonly api =
    inject(NotificationsApiService);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly items =
    signal<NotificationItem[]>([]);

  readonly loading =
    signal(false);

  readonly actionId =
    signal<string | null>(
      null
    );

  readonly bulkLoading =
    signal(false);

  readonly error =
    signal(false);

  readonly search =
    signal('');

  readonly readFilter =
    signal('');

  readonly archivedFilter =
    signal('false');

  readonly typeFilter =
    signal('');

  readonly pageNumber =
    signal(1);

  readonly pageSize =
    signal(20);

  readonly totalCount =
    signal(0);

  readonly totalPages =
    signal(1);

  readonly unreadCount =
    signal(0);

  readonly sortBy =
    signal<NotificationSortField>(
      'createdAtUtc'
    );

  readonly sortDirection =
    signal<SortDirection>(
      'desc'
    );

  readonly pageUnread =
    computed(
      () =>
        this.items()
          .filter(
            item =>
              !item.isRead &&
              !item.isDeleted
          )
          .length
    );

  readonly pageRead =
    computed(
      () =>
        this.items()
          .filter(
            item =>
              item.isRead &&
              !item.isDeleted
          )
          .length
    );

  readonly pageArchived =
    computed(
      () =>
        this.items()
          .filter(
            item =>
              item.isArchived &&
              !item.isDeleted
          )
          .length
    );

  constructor() {
    this.load();
    this.loadUnreadCount();
  }

  load(): void {

    this.loading.set(
      true
    );

    this.error.set(
      false
    );

    const read =
      this.readFilter();

    const archived =
      this.archivedFilter();

    this.api
      .getAll({
        pageNumber:
          this.pageNumber(),

        pageSize:
          this.pageSize(),

        search:
          this.search(),

        isRead:
          read === ''
            ? undefined
            : read === 'true',

        isArchived:
          archived === ''
            ? undefined
            : archived === 'true',

        type:
          this.typeFilter(),

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
              'Notifications API error',
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

  loadUnreadCount(): void {

    this.api
      .getUnreadCount()
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        )
      )
      .subscribe({
        next:
          result =>
            this.unreadCount.set(
              result.unreadCount ??
              0
            ),

        error:
          error =>
            console.warn(
              'Unread count endpoint unavailable',
              error
            )
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

    this.readFilter.set(
      ''
    );

    this.archivedFilter.set(
      'false'
    );

    this.typeFilter.set(
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
      page > this.totalPages()
    ) {
      return;
    }

    this.pageNumber.set(
      page
    );

    this.load();
  }

  markRead(
    item: NotificationItem
  ): void {

    this.runItemAction(
      item,
      this.api.markRead(
        item.id
      )
    );
  }

  markUnread(
    item: NotificationItem
  ): void {

    this.runItemAction(
      item,
      this.api.markUnread(
        item.id
      )
    );
  }

  archive(
    item: NotificationItem
  ): void {

    this.runItemAction(
      item,
      this.api.archive(
        item.id
      )
    );
  }

  unarchive(
    item: NotificationItem
  ): void {

    this.runItemAction(
      item,
      this.api.unarchive(
        item.id
      )
    );
  }

  restore(
    item: NotificationItem
  ): void {

    this.runItemAction(
      item,
      this.api.restore(
        item.id
      )
    );
  }

  deleteItem(
    item: NotificationItem
  ): void {

    if (
      this.actionId()
    ) {
      return;
    }

    if (
      !window.confirm(
        `Delete notification "${item.title}"?`
      )
    ) {
      return;
    }

    this.runItemAction(
      item,
      this.api.delete(
        item.id
      )
    );
  }

  markAllRead(): void {

    if (
      this.bulkLoading()
    ) {
      return;
    }

    this.bulkLoading.set(
      true
    );

    this.api
      .markAllRead()
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        ),

        finalize(
          () =>
            this.bulkLoading.set(
              false
            )
        )
      )
      .subscribe({
        next:
          () => {
            this.load();
            this.loadUnreadCount();
          },

        error:
          error =>
            console.error(
              'Mark all read error',
              error
            )
      });
  }

  private runItemAction(
    item: NotificationItem,
    request:
      import('rxjs').Observable<unknown>
  ): void {

    if (
      this.actionId()
    ) {
      return;
    }

    this.actionId.set(
      item.id
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
          () => {
            this.load();
            this.loadUnreadCount();
          },

        error:
          error =>
            console.error(
              'Notification action error',
              error
            )
      });
  }
}
