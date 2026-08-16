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
  LucideArrowLeft,
  LucideBarChart3,
  LucideCheckCircle2,
  LucideCircleCheck,
  LucideCircleX,
  LucideClock,
  LucidePercent,
  LucideRefreshCw
} from '@lucide/angular';

import {
  finalize
} from 'rxjs';

import {
  takeUntilDestroyed
} from '@angular/core/rxjs-interop';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  RoomChange
} from '../../models/room-change.model';

import {
  RoomChangesApiService
} from '../../services/room-changes-api.service';

@Component({
  selector:
    'app-room-change-analytics-page',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,
    TranslationPipe,
    LucideArrowLeft,
    LucideBarChart3,
    LucideCheckCircle2,
    LucideCircleCheck,
    LucideCircleX,
    LucideClock,
    LucidePercent,
    LucideRefreshCw
  ],

  templateUrl:
    './room-change-analytics.page.html',

  styleUrl:
    './room-change-analytics.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class RoomChangeAnalyticsPage {

  private readonly api =
    inject(RoomChangesApiService);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly roomChanges =
    signal<RoomChange[]>([]);

  readonly loading =
    signal(false);

  readonly errorKey =
    signal<string | null>(
      null
    );

  readonly totalChanges =
    computed(
      () =>
        this.roomChanges().length
    );

  readonly completedCount =
    computed(
      () =>
        this.countByStatus(
          'Completed'
        )
    );

  readonly approvedCount =
    computed(
      () =>
        this.countByStatus(
          'Approved'
        )
    );

  readonly pendingCount =
    computed(
      () =>
        this.countByStatus(
          'Pending'
        )
    );

  readonly rejectedCount =
    computed(
      () =>
        this.countByStatus(
          'Rejected'
        )
    );

  readonly cancelledCount =
    computed(
      () =>
        this.countByStatus(
          'Cancelled'
        )
    );

  readonly completionRate =
    computed(() => {

      const total =
        this.totalChanges();

      if (
        total ===
        0
      ) {
        return 0;
      }

      return (
        this.completedCount()
        /
        total
      ) * 100;
    });

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

    this.api
      .getAll({
        pageNumber:
          1,

        pageSize:
          1000,

        sortBy:
          'requestedAtUtc',

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
            this.roomChanges.set(
              result.items ??
              []
            ),

        error:
          error => {

            console.error(
              error
            );

            this.roomChanges.set(
              []
            );

            this.errorKey.set(
              'roomChanges.errors.loadAnalytics'
            );
          }
      });
  }

  private countByStatus(
    status: string
  ): number {

    return this.roomChanges()
      .filter(
        item =>
          item.status ===
          status
      )
      .length;
  }
}
