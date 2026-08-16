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
  RouterLink
} from '@angular/router';

import {
  finalize
} from 'rxjs';

import {
  takeUntilDestroyed
} from '@angular/core/rxjs-interop';

import {
  LucideArrowLeft,
  LucideBarChart3,
  LucideBell,
  LucideMail,
  LucideMailOpen,
  LucideArchive
} from '@lucide/angular';

import {
  NotificationItem
} from '../../models/notification.model';

import {
  NotificationsApiService
} from '../../data-access/notifications-api.service';

@Component({
  selector:
    'app-notifications-analytics-page',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,
    LucideArrowLeft,
    LucideBarChart3,
    LucideBell,
    LucideMail,
    LucideMailOpen,
    LucideArchive
  ],

  templateUrl:
    './notifications-analytics.page.html',

  styleUrl:
    './notifications-analytics.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class NotificationsAnalyticsPage {

  private readonly api =
    inject(NotificationsApiService);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly items =
    signal<NotificationItem[]>([]);

  readonly loading =
    signal(false);

  readonly total =
    computed(
      () =>
        this.items().length
    );

  readonly unread =
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

  readonly read =
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

  readonly archived =
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

  readonly urgent =
    computed(
      () =>
        this.items()
          .filter(
            item =>
              item.priority ===
              'Urgent'
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

    this.api
      .getAll({
        pageNumber:
          1,

        pageSize:
          1000,

        sortBy:
          'createdAtUtc',

        sortDirection:
          'desc'
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
          result =>
            this.items.set(
              result.items ??
              []
            ),

        error:
          error =>
            console.error(
              'Notification analytics error',
              error
            )
      });
  }
}
