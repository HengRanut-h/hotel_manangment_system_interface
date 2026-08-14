import {
  DatePipe
} from '@angular/common';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  LucideCheck,
  LucideChevronLeft,
  LucideChevronRight,
  LucideCirclePlus,
  LucideClock,
  LucideCircleAlert,
  LucideEye,
  LucideLayoutGrid,
  LucideList,
  LucideRefreshCw,
  LucideRotateCcw,
  LucideSearch,
  LucideSparkles,
  LucideUserRound
} from '@lucide/angular';

import {
  AuthStore
} from '../../../../../core/auth/auth.store';

import {
  getSafeApiErrorMessage
} from '../../../../../core/http/api-error.util';

import {
  ApiClientService
} from '../../../../../core/http/api-client.service';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  TranslationService
} from '../../../../../core/i18n/translation.service';

import {
  ModalComponent
} from '../../../../../shared/ui/modal/modal.component';

import {
  SpinComponent
} from '../../../../../shared/ui/spin/spin.component';

import {
  ToastService
} from '../../../../../shared/ui/toast/toast.service';

import {
  HousekeepingApiService
} from '../../data-access/housekeeping-api.service';

import {
  HousekeepingPriority,
  housekeepingPriorities,
  HousekeepingStatus,
  housekeepingStatuses,
  HousekeepingTask,
  RoomOption
} from '../../models/housekeeping.model';

interface RoomResponse {
  id: string;
  roomNumber: string;
}

interface PagedRooms {
  items?: RoomResponse[];
}

@Component({
  selector: 'app-housekeeping-list-page',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    TranslationPipe,
    ModalComponent,
    SpinComponent,
    LucideCheck,
    LucideChevronLeft,
    LucideChevronRight,
    LucideCircleAlert,
    LucideCirclePlus,
    LucideClock,
    LucideEye,
    LucideLayoutGrid,
    LucideList,
    LucideRefreshCw,
    LucideRotateCcw,
    LucideSearch,
    LucideSparkles,
    LucideUserRound
  ],
  templateUrl: './housekeeping-list.page.html',
  styleUrl: './housekeeping-list.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HousekeepingListPage
  implements OnInit {

  readonly auth =
    inject(
      AuthStore
    );

  private readonly api =
    inject(
      HousekeepingApiService
    );

  private readonly apiClient =
    inject(
      ApiClientService
    );

  private readonly toast =
    inject(
      ToastService
    );

  private readonly translation =
    inject(
      TranslationService
    );

  readonly statuses =
    housekeepingStatuses;

  readonly priorities =
    housekeepingPriorities;

  readonly rows =
    signal<HousekeepingTask[]>(
      []
    );

  readonly rooms =
    signal<RoomOption[]>(
      []
    );

  readonly loading =
    signal(
      true
    );

  readonly roomsLoading =
    signal(
      false
    );

  readonly error =
    signal(
      ''
    );

  readonly roomLoadError =
    signal(
      ''
    );

  readonly modalOpen =
    signal(
      false
    );

  readonly detailOpen =
    signal(
      false
    );

  readonly detailLoading =
    signal(
      false
    );

  readonly detail =
    signal<HousekeepingTask | null>(
      null
    );

  readonly saving =
    signal(
      false
    );

  readonly mutatingId =
    signal<string | null>(
      null
    );

  readonly search =
    signal(
      ''
    );

  readonly status =
    signal(
      ''
    );

  readonly priority =
    signal(
      ''
    );

  readonly viewMode =
    signal<'board' | 'list'>(
      'board'
    );

  readonly pageNumber =
    signal(
      1
    );

  readonly pageSize =
    signal(
      12
    );

  roomId = '';
  taskType = '';
  formPriority: HousekeepingPriority = 'Normal';

  readonly filteredRows =
    computed(
      () => {

        const search =
          this.search()
            .trim()
            .toLowerCase();

        const status =
          this.status();

        const priority =
          this.priority();

        return this.rows()
          .filter(
            row =>
              (
                !search
                ||
                row.roomNumber
                  .toLowerCase()
                  .includes(
                    search
                  )
                ||
                row.taskType
                  .toLowerCase()
                  .includes(
                    search
                  )
              )
              &&
              (
                !status
                ||
                row.status === status
              )
              &&
              (
                !priority
                ||
                row.priority === priority
              )
          );
      }
    );

  readonly totalPages =
    computed(
      () =>
        Math.max(
          1,
          Math.ceil(
            this.filteredRows().length /
            this.pageSize()
          )
        )
    );

  readonly pagedRows =
    computed(
      () => {

        const page =
          Math.min(
            this.pageNumber(),
            this.totalPages()
          );

        const start =
          (page - 1) *
          this.pageSize();

        return this.filteredRows()
          .slice(
            start,
            start + this.pageSize()
          );
      }
    );

  readonly hasActiveFilters =
    computed(
      () =>
        Boolean(
          this.search().trim()
          ||
          this.status()
          ||
          this.priority()
        )
    );

  readonly firstResultNumber =
    computed(
      () =>
        this.filteredRows().length
          ? (
            (
              Math.min(
                this.pageNumber(),
                this.totalPages()
              ) - 1
            ) *
            this.pageSize()
          ) + 1
          : 0
    );

  readonly lastResultNumber =
    computed(
      () =>
        this.filteredRows().length
          ? Math.min(
            this.firstResultNumber() +
            this.pagedRows().length -
            1,
            this.filteredRows().length
          )
          : 0
    );

  readonly openOnPage =
    computed(
      () =>
        this.pagedRows()
          .filter(
            row =>
              row.status !== 'Completed'
              &&
              row.status !== 'Cancelled'
          )
          .length
    );

  readonly unassignedOnPage =
    computed(
      () =>
        this.pagedRows()
          .filter(
            row =>
              !row.assignedUserId
          )
          .length
    );

  readonly completedOnPage =
    computed(
      () =>
        this.pagedRows()
          .filter(
            row =>
              row.status === 'Completed'
          )
          .length
    );

  ngOnInit(): void {

    this.load();
  }

  load(): void {

    this.loading.set(
      true
    );

    this.error.set(
      ''
    );

    this.api
      .getAll()
      .subscribe({
        next:
          rows => {

            this.rows.set(
              rows
            );

            this.pageNumber.set(
              1
            );

            this.loading.set(
              false
            );
          },
        error:
          error => {

            this.rows.set(
              []
            );

            this.error.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'housekeeping.loadFailed'
                )
              )
            );

            this.loading.set(
              false
            );
          }
      });
  }

  openCreate(): void {

    if (
      !this.auth.hasPermission(
        'housekeeping.manage'
      )
    ) {
      return;
    }

    this.roomId = '';
    this.taskType =
      this.translation.translate(
        'housekeeping.defaultTaskType'
      );
    this.formPriority = 'Normal';
    this.modalOpen.set(
      true
    );
    this.loadRooms();
  }

  save(): void {

    if (
      this.saving()
      ||
      !this.roomId
      ||
      !this.taskType.trim()
    ) {
      return;
    }

    this.saving.set(
      true
    );

    this.api
      .create({
        roomId:
          this.roomId,
        taskType:
          this.taskType.trim(),
        priority:
          this.formPriority
      })
      .subscribe({
        next:
          () => {

            this.toast.success(
              this.translation.translate(
                'housekeeping.createSuccess'
              )
            );

            this.modalOpen.set(
              false
            );

            this.saving.set(
              false
            );

            this.load();
          },
        error:
          error => {

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'housekeeping.createFailed'
                )
              )
            );

            this.saving.set(
              false
            );
          }
      });
  }

  view(
    row: HousekeepingTask
  ): void {

    this.detailOpen.set(
      true
    );

    this.detailLoading.set(
      true
    );

    this.detail.set(
      null
    );

    this.api
      .getById(
        row.id
      )
      .subscribe({
        next:
          task => {

            this.detail.set(
              task
            );

            this.detailLoading.set(
              false
            );
          },
        error:
          error => {

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'housekeeping.loadOneFailed'
                )
              )
            );

            this.detailLoading.set(
              false
            );

            this.detailOpen.set(
              false
            );
          }
      });
  }

  complete(
    row: HousekeepingTask
  ): void {

    if (
      this.mutatingId()
      ||
      row.status === 'Completed'
    ) {
      return;
    }

    this.mutatingId.set(
      row.id
    );

    this.api
      .complete(
        row.id
      )
      .subscribe({
        next:
          () => {

            this.toast.success(
              this.translation.translate(
                'housekeeping.completeSuccess'
              )
            );

            this.mutatingId.set(
              null
            );

            this.load();
          },
        error:
          error => {

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'housekeeping.completeFailed'
                )
              )
            );

            this.mutatingId.set(
              null
            );
          }
      });
  }

  canComplete(
    row: HousekeepingTask
  ): boolean {

    return this.auth.hasPermission(
      'housekeeping.manage'
    )
      &&
      row.status !== 'Completed'
      &&
      row.status !== 'Cancelled';
  }

  clearFilters(): void {

    this.search.set(
      ''
    );

    this.status.set(
      ''
    );

    this.priority.set(
      ''
    );

    this.pageNumber.set(
      1
    );
  }

  previousPage(): void {

    if (
      this.pageNumber() > 1
    ) {
      this.pageNumber.update(
        value =>
          value - 1
      );
    }
  }

  nextPage(): void {

    if (
      this.pageNumber() < this.totalPages()
    ) {
      this.pageNumber.update(
        value =>
          value + 1
      );
    }
  }

  statusLabel(
    status: string
  ): string {

    return this.lookupLabel(
      'statuses',
      status
    );
  }

  priorityLabel(
    priority: string
  ): string {

    return this.lookupLabel(
      'priorities',
      priority
    );
  }

  statusClass(
    status: string
  ): string {

    const normalized =
      status.toLowerCase();

    if (
      normalized === 'completed'
    ) {
      return 'status-badge status-badge--success';
    }

    if (
      normalized === 'cancelled'
    ) {
      return 'status-badge status-badge--danger';
    }

    if (
      normalized === 'inprogress'
      ||
      normalized === 'assigned'
    ) {
      return 'status-badge status-badge--info';
    }

    return 'status-badge status-badge--warning';
  }

  private loadRooms(): void {

    if (
      this.rooms().length
      ||
      this.roomsLoading()
    ) {
      return;
    }

    this.roomsLoading.set(
      true
    );

    this.roomLoadError.set(
      ''
    );

    this.apiClient
      .get<PagedRooms | RoomResponse[]>(
        'rooms',
        {
          pageNumber: 1,
          pageSize: 100
        }
      )
      .subscribe({
        next:
          response => {

            const rooms =
              Array.isArray(
                response
              )
                ? response
                : response.items ?? [];

            this.rooms.set(
              rooms.map(
                room => ({
                  id:
                    room.id,
                  roomNumber:
                    room.roomNumber
                })
              )
            );

            this.roomsLoading.set(
              false
            );
          },
        error:
          error => {

            this.roomLoadError.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'housekeeping.roomsLoadFailed'
                )
              )
            );

            this.roomsLoading.set(
              false
            );
          }
      });
  }

  private lookupLabel(
    group: string,
    value: string
  ): string {

    const normalized =
      value
        .replace(
          /([a-z])([A-Z])/g,
          '$1-$2'
        )
        .toLowerCase();

    const key =
      normalized.replace(
        /-/g,
        ''
      );

    const translated =
      this.translation.translate(
        `housekeeping.${group}.${key}`
      );

    return translated === `housekeeping.${group}.${key}`
      ? value
      : translated;
  }

}
