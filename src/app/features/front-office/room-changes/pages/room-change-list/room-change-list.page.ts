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
  LucideBarChart3,
  LucideCheckCircle2,
  LucideChevronLeft,
  LucideChevronRight,
  LucideCircleCheck,
  LucideClipboardList,
  LucideClock,
  LucideEye,
  LucideRefreshCw,
  LucideSearch,
  LucideX
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
  RoomChange,
  RoomChangeSortField,
  SortDirection
} from '../../models/room-change.model';

import {
  RoomChangesApiService
} from '../../services/room-changes-api.service';

import {
  RoomChangeStatusBadgeComponent
} from '../../components/room-change-status-badge/room-change-status-badge.component';

@Component({
  selector:
    'app-room-change-list-page',

  standalone:
    true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    TranslationPipe,
    RoomChangeStatusBadgeComponent,
    LucideBarChart3,
    LucideCheckCircle2,
    LucideChevronLeft,
    LucideChevronRight,
    LucideCircleCheck,
    LucideClipboardList,
    LucideClock,
    LucideEye,
    LucideRefreshCw,
    LucideSearch,
    LucideX
  ],

  templateUrl:
    './room-change-list.page.html',

  styleUrl:
    './room-change-list.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class RoomChangeListPage {

  private readonly api =
    inject(RoomChangesApiService);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly roomChanges =
    signal<RoomChange[]>([]);

  readonly loading =
    signal(false);

  readonly errorKey =
    signal<string | null>(null);

  readonly search =
    signal('');

  readonly status =
    signal('');

  readonly pageNumber =
    signal(1);

  readonly pageSize =
    signal(10);

  readonly totalCount =
    signal(0);

  readonly totalPages =
    signal(1);

  readonly sortBy =
    signal<RoomChangeSortField>(
      'requestedAtUtc'
    );

  readonly sortDirection =
    signal<SortDirection>(
      'desc'
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

  readonly completedCount =
    computed(
      () =>
        this.roomChanges()
          .filter(
            item =>
              item.status ===
              'Completed'
          )
          .length
    );

  readonly pendingCount =
    computed(
      () =>
        this.roomChanges()
          .filter(
            item =>
              item.status ===
              'Pending'
          )
          .length
    );

  readonly approvedCount =
    computed(
      () =>
        this.roomChanges()
          .filter(
            item =>
              item.status ===
              'Approved'
          )
          .length
    );

  constructor() {
    this.loadRoomChanges();
  }

  loadRoomChanges(): void {

    this.loading.set(
      true
    );

    this.errorKey.set(
      null
    );

    this.api
      .getAll({
        pageNumber:
          this.pageNumber(),

        pageSize:
          this.pageSize(),

        search:
          this.search(),

        status:
          this.status(),

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

            this.roomChanges.set(
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
                Math.ceil(
                  (
                    result.totalCount ??
                    0
                  )
                  /
                  (
                    result.pageSize ||
                    this.pageSize()
                  )
                )
              )
            );
          },

        error:
          error => {

            console.error(
              error
            );

            this.roomChanges.set(
              []
            );

            this.errorKey.set(
              'roomChanges.errors.loadList'
            );
          }
      });
  }

  onSearch(): void {

    this.pageNumber.set(
      1
    );

    this.loadRoomChanges();
  }

  onFilterChange(): void {

    this.pageNumber.set(
      1
    );

    this.loadRoomChanges();
  }

  clearFilters(): void {

    this.search.set(
      ''
    );

    this.status.set(
      ''
    );

    this.pageNumber.set(
      1
    );

    this.loadRoomChanges();
  }

  changePage(
    page: number
  ): void {

    if (
      page < 1 ||
      page >
        this.totalPages() ||
      page ===
        this.pageNumber()
    ) {
      return;
    }

    this.pageNumber.set(
      page
    );

    this.loadRoomChanges();
  }

  changePageSize(
    value: number | string
  ): void {

    this.pageSize.set(
      Number(
        value
      )
    );

    this.pageNumber.set(
      1
    );

    this.loadRoomChanges();
  }

  sort(
    field:
      RoomChangeSortField
  ): void {

    if (
      this.sortBy() ===
      field
    ) {

      this.sortDirection.update(
        direction =>
          direction ===
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

    this.loadRoomChanges();
  }

  sortIndicator(
    field:
      RoomChangeSortField
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
}
