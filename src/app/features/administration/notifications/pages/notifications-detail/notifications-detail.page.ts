import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import {
  Observable,
  finalize
} from 'rxjs';

import {
  takeUntilDestroyed
} from '@angular/core/rxjs-interop';

import {
  LucideArrowLeft,
  LucideBell,
  LucideMail,
  LucideMailOpen,
  LucideArchive,
  LucideRotateCcw,
  LucideTrash2,
  LucideExternalLink
} from '@lucide/angular';

import {
  NotificationItem
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
    'app-notifications-detail-page',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,

    NotificationTypeBadgeComponent,
    NotificationPriorityBadgeComponent,

    LucideArrowLeft,
    LucideBell,
    LucideMail,
    LucideMailOpen,
    LucideArchive,
    LucideRotateCcw,
    LucideTrash2,
    LucideExternalLink
  ],

  templateUrl:
    './notifications-detail.page.html',

  styleUrl:
    './notifications-detail.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class NotificationsDetailPage {

  private readonly api =
    inject(NotificationsApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly item =
    signal<NotificationItem | null>(
      null
    );

  readonly loading =
    signal(false);

  readonly actionLoading =
    signal(false);

  readonly error =
    signal(false);

  readonly id =
    this.route.snapshot.paramMap.get(
      'id'
    );

  constructor() {

    if (
      this.id
    ) {
      this.load();
    } else {
      this.error.set(
        true
      );
    }
  }

  load(): void {

    if (
      !this.id
    ) {
      return;
    }

    this.loading.set(
      true
    );

    this.error.set(
      false
    );

    this.api
      .getById(
        this.id
      )
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
          item => {

            this.item.set(
              item
            );

            if (
              !item.isRead &&
              !item.isDeleted
            ) {
              this.api
                .markRead(
                  item.id
                )
                .pipe(
                  takeUntilDestroyed(
                    this.destroyRef
                  )
                )
                .subscribe({
                  next:
                    () =>
                      this.item.update(
                        current =>
                          current
                            ? {
                                ...current,
                                isRead:
                                  true,
                                readAtUtc:
                                  new Date()
                                    .toISOString()
                              }
                            : current
                      ),

                  error:
                    error =>
                      console.warn(
                        'Auto mark-read failed',
                        error
                      )
                });
            }
          },

        error:
          error => {

            console.error(
              'Notification detail error',
              error
            );

            this.error.set(
              true
            );
          }
      });
  }

  markRead(): void {

    const item =
      this.item();

    if (
      item
    ) {
      this.runAction(
        this.api.markRead(
          item.id
        )
      );
    }
  }

  markUnread(): void {

    const item =
      this.item();

    if (
      item
    ) {
      this.runAction(
        this.api.markUnread(
          item.id
        )
      );
    }
  }

  archive(): void {

    const item =
      this.item();

    if (
      item
    ) {
      this.runAction(
        this.api.archive(
          item.id
        )
      );
    }
  }

  unarchive(): void {

    const item =
      this.item();

    if (
      item
    ) {
      this.runAction(
        this.api.unarchive(
          item.id
        )
      );
    }
  }

  restore(): void {

    const item =
      this.item();

    if (
      item
    ) {
      this.runAction(
        this.api.restore(
          item.id
        )
      );
    }
  }

  deleteItem(): void {

    const item =
      this.item();

    if (
      !item ||
      this.actionLoading()
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

    this.actionLoading.set(
      true
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
            this.actionLoading.set(
              false
            )
        )
      )
      .subscribe({
        next:
          () =>
            this.router.navigate(
              [
                '/app/inbox/notifications'
              ]
            ),

        error:
          error => {

            console.error(
              'Delete notification error',
              error
            );

            this.error.set(
              true
            );
          }
      });
  }

  private runAction(
    request:
      Observable<unknown>
  ): void {

    if (
      this.actionLoading()
    ) {
      return;
    }

    this.actionLoading.set(
      true
    );

    request
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        ),

        finalize(
          () =>
            this.actionLoading.set(
              false
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
              'Notification action error',
              error
            );

            this.error.set(
              true
            );
          }
      });
  }
}
