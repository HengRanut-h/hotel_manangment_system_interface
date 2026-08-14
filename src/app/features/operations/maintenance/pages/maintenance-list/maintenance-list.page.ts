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
  finalize
} from 'rxjs';

import {
  LucideCheck,
  LucideChevronLeft,
  LucideChevronRight,
  LucideCircleAlert,
  LucideCirclePlus,
  LucideClock,
  LucideEye,
  LucideFilter,
  LucideRefreshCw,
  LucideRotateCcw,
  LucideSearch,
  LucideWrench
} from '@lucide/angular';

import {
  AuthStore
} from '../../../../../core/auth/auth.store';

import {
  getSafeApiErrorMessage
} from '../../../../../core/http/api-error.util';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  TranslationService
} from '../../../../../core/i18n/translation.service';

import {
  RoomApiService
} from '../../../../property/rooms/data-access/room-api.service';

import {
  Room
} from '../../../../property/rooms/models/room.model';

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
  MaintenanceApiService
} from '../../data-access/maintenance-api.service';

import {
  CreateMaintenanceRequest,
  MaintenanceRequest,
  maintenanceStatuses
} from '../../models/maintenance.model';

interface MaintenanceFormState {
  roomId: string;
  category: string;
  description: string;
  priority: string;
}

@Component({
  selector: 'app-maintenance-list-page',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    LucideCheck,
    LucideChevronLeft,
    LucideChevronRight,
    LucideCircleAlert,
    LucideCirclePlus,
    LucideClock,
    LucideEye,
    LucideFilter,
    LucideRefreshCw,
    LucideRotateCcw,
    LucideSearch,
    LucideWrench,
    ModalComponent,
    SpinComponent,
    TranslationPipe
  ],
  templateUrl: './maintenance-list.page.html',
  styleUrl: './maintenance-list.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaintenanceListPage implements OnInit {

  readonly auth =
    inject(
      AuthStore
    );

  private readonly api =
    inject(
      MaintenanceApiService
    );

  private readonly roomApi =
    inject(
      RoomApiService
    );

  private readonly toast =
    inject(
      ToastService
    );

  private readonly translation =
    inject(
      TranslationService
    );

  readonly rows =
    signal<MaintenanceRequest[]>(
      []
    );

  readonly rooms =
    signal<Room[]>(
      []
    );

  readonly loading =
    signal(false);

  readonly roomsLoading =
    signal(false);

  readonly error =
    signal('');

  readonly search =
    signal('');

  readonly status =
    signal('');

  readonly priority =
    signal('');

  readonly pageNumber =
    signal(1);

  readonly pageSize =
    signal(10);

  readonly modalOpen =
    signal(false);

  readonly detailOpen =
    signal(false);

  readonly detailLoading =
    signal(false);

  readonly detail =
    signal<MaintenanceRequest | null>(
      null
    );

  readonly saving =
    signal(false);

  readonly mutatingId =
    signal<string | null>(
      null
    );

  readonly form =
    signal<MaintenanceFormState>(
      this.emptyForm()
    );

  readonly statuses =
    maintenanceStatuses;

  readonly priorities =
    computed(
      () =>
        [
          ...new Set(
            this.rows()
              .map(
                row =>
                  row.priority
                    .trim()
              )
              .filter(
                Boolean
              )
          )
        ]
    );

  readonly filteredRows =
    computed(
      () => {
        const searchTerm =
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
              !status ||
              row.status === status
          )
          .filter(
            row =>
              !priority ||
              row.priority === priority
          )
          .filter(
            row =>
              !searchTerm ||
              [
                row.roomNumber ?? '',
                row.category,
                row.description
              ]
                .join(' ')
                .toLowerCase()
                .includes(
                  searchTerm
                )
          );
      }
    );

  readonly pagedRows =
    computed(
      () => {
        const start =
          (
            this.pageNumber() -
            1
          ) *
          this.pageSize();

        return this.filteredRows()
          .slice(
            start,
            start + this.pageSize()
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

  readonly openCount =
    computed(
      () =>
        this.rows()
          .filter(
            row =>
              row.status === 'Open' ||
              row.status === 'Assigned'
          )
          .length
    );

  readonly inProgressCount =
    computed(
      () =>
        this.rows()
          .filter(
            row =>
              row.status === 'InProgress' ||
              row.status === 'OnHold'
          )
          .length
    );

  readonly completedCount =
    computed(
      () =>
        this.rows()
          .filter(
            row =>
              row.status === 'Completed'
          )
          .length
    );

  ngOnInit(): void {

    this.load();
    this.loadRooms();
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
      .pipe(
        finalize(
          () =>
            this.loading.set(
              false
            )
        )
      )
      .subscribe({
        next:
          rows => {
            this.rows.set(
              rows
            );
            this.clampPage();
          },
        error:
          error =>
            this.error.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'maintenance.loadFailed'
                )
              )
            )
      });
  }

  loadRooms(): void {

    if (
      !this.auth.hasPermission(
        'rooms.view'
      )
    ) {
      return;
    }

    this.roomsLoading.set(
      true
    );

    this.roomApi
      .getPage({
        pageNumber: 1,
        pageSize: 100
      })
      .pipe(
        finalize(
          () =>
            this.roomsLoading.set(
              false
            )
        )
      )
      .subscribe({
        next:
          response =>
            this.rooms.set(
              response.items
            ),
        error:
          () =>
            this.rooms.set(
              []
            )
      });
  }

  applyFilters(): void {

    this.pageNumber.set(
      1
    );
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

  hasActiveFilters(): boolean {

    return !!(
      this.search().trim() ||
      this.status() ||
      this.priority()
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
      this.pageNumber() <
      this.totalPages()
    ) {
      this.pageNumber.update(
        value =>
          value + 1
      );
    }
  }

  firstResultNumber(): number {

    if (
      !this.filteredRows().length
    ) {
      return 0;
    }

    return (
      this.pageNumber() -
      1
    ) *
      this.pageSize() +
      1;
  }

  lastResultNumber(): number {

    return Math.min(
      this.pageNumber() *
        this.pageSize(),
      this.filteredRows().length
    );
  }

  openCreate(): void {

    this.form.set(
      this.emptyForm()
    );
    this.modalOpen.set(
      true
    );
  }

  updateForm(
    field: keyof MaintenanceFormState,
    value: string
  ): void {

    this.form.update(
      current => ({
        ...current,
        [field]: value
      })
    );
  }

  save(): void {

    const form =
      this.form();

    if (
      !form.category.trim() ||
      !form.description.trim() ||
      !form.priority.trim()
    ) {
      return;
    }

    const request: CreateMaintenanceRequest = {
      roomId:
        form.roomId || null,
      category:
        form.category.trim(),
      description:
        form.description.trim(),
      priority:
        form.priority.trim()
    };

    this.saving.set(
      true
    );

    this.api
      .create(
        request
      )
      .pipe(
        finalize(
          () =>
            this.saving.set(
              false
            )
        )
      )
      .subscribe({
        next:
          () => {
            this.toast.success(
              this.translation.translate(
                'maintenance.createSuccess'
              )
            );
            this.modalOpen.set(
              false
            );
            this.load();
          },
        error:
          error =>
            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'maintenance.createFailed'
                )
              )
            )
      });
  }

  view(
    row: MaintenanceRequest
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
      .pipe(
        finalize(
          () =>
            this.detailLoading.set(
              false
            )
        )
      )
      .subscribe({
        next:
          item =>
            this.detail.set(
              item
            ),
        error:
          error =>
            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'maintenance.loadOneFailed'
                )
              )
            )
      });
  }

  complete(
    row: MaintenanceRequest
  ): void {

    this.mutatingId.set(
      row.id
    );

    this.api
      .complete(
        row.id
      )
      .pipe(
        finalize(
          () =>
            this.mutatingId.set(
              null
            )
        )
      )
      .subscribe({
        next:
          () => {
            this.toast.success(
              this.translation.translate(
                'maintenance.completeSuccess'
              )
            );
            this.load();
          },
        error:
          error =>
            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'maintenance.completeFailed'
                )
              )
            )
      });
  }

  canComplete(
    row: MaintenanceRequest
  ): boolean {

    return this.auth.hasPermission(
      'maintenance.manage'
    )
    &&
    row.status !== 'Completed'
    &&
    row.status !== 'Cancelled';
  }

  statusLabel(
    status: string
  ): string {

    return this.translation.translate(
      `maintenance.statuses.${status.toLowerCase()}`
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
      return 'status-pill status-pill--success';
    }

    if (
      normalized === 'inprogress' ||
      normalized === 'onhold'
    ) {
      return 'status-pill status-pill--warning';
    }

    if (
      normalized === 'cancelled'
    ) {
      return 'status-pill status-pill--danger';
    }

    return 'status-pill status-pill--info';
  }

  priorityClass(
    priority: string
  ): string {

    const normalized =
      priority.toLowerCase();

    if (
      normalized === 'urgent'
    ) {
      return 'priority-pill priority-pill--urgent';
    }

    if (
      normalized === 'high'
    ) {
      return 'priority-pill priority-pill--high';
    }

    if (
      normalized === 'low'
    ) {
      return 'priority-pill priority-pill--low';
    }

    return 'priority-pill priority-pill--normal';
  }

  private clampPage(): void {

    if (
      this.pageNumber() >
      this.totalPages()
    ) {
      this.pageNumber.set(
        this.totalPages()
      );
    }
  }

  private emptyForm(): MaintenanceFormState {

    return {
      roomId: '',
      category: '',
      description: '',
      priority: 'Normal'
    };
  }

}
