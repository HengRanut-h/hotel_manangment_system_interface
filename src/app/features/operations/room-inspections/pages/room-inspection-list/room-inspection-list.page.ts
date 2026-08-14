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
  LucideCircleAlert,
  LucideCirclePlus,
  LucideCircleX,
  LucideClipboardCheck,
  LucideEye,
  LucidePencil,
  LucideRefreshCw,
  LucideRotateCcw,
  LucideSearch,
  LucideTrash2
} from '@lucide/angular';

import {
  AuthStore
} from '../../../../../core/auth/auth.store';

import {
  getSafeApiErrorMessage
} from '../../../../../core/http/api-error.util';

import {
  PaginationMeta
} from '../../../../../core/http/api-response.models';

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
  RoomInspectionApiService
} from '../../data-access/room-inspection-api.service';

import {
  RoomInspection,
  RoomInspectionStatus,
  roomInspectionStatuses
} from '../../models/room-inspection.model';

interface RoomInspectionForm {
  title: string;
  status: string;
  eventAtUtc: string;
  notes: string;
  amount: number;
}

const emptyPagination = (): PaginationMeta => ({
  pageNumber: 1,
  pageSize: 20,
  totalItems: 0,
  totalPages: 1,
  hasPreviousPage: false,
  hasNextPage: false
});

@Component({
  selector: 'app-room-inspection-list-page',
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
    LucideCircleX,
    LucideClipboardCheck,
    LucideEye,
    LucidePencil,
    LucideRefreshCw,
    LucideRotateCcw,
    LucideSearch,
    LucideTrash2
  ],
  templateUrl: './room-inspection-list.page.html',
  styleUrl: './room-inspection-list.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomInspectionListPage implements OnInit {

  readonly auth =
    inject(
      AuthStore
    );

  private readonly api =
    inject(
      RoomInspectionApiService
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
    roomInspectionStatuses;

  readonly rows =
    signal<RoomInspection[]>(
      []
    );

  readonly pagination =
    signal<PaginationMeta>(
      emptyPagination()
    );

  readonly loading =
    signal(
      true
    );

  readonly error =
    signal(
      ''
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
    signal<RoomInspection | null>(
      null
    );

  readonly editingId =
    signal<string | null>(
      null
    );

  readonly form =
    signal<RoomInspectionForm>(
      this.createEmptyForm()
    );

  readonly hasActiveFilters =
    computed(
      () =>
        Boolean(
          this.search().trim()
          ||
          this.status()
        )
    );

  readonly openOnPage =
    computed(
      () =>
        this.rows()
          .filter(
            row =>
              row.status !== 'Completed'
              &&
              row.status !== 'Cancelled'
              &&
              row.status !== 'Rejected'
          )
          .length
    );

  readonly completedOnPage =
    computed(
      () =>
        this.rows()
          .filter(
            row =>
              row.status === 'Completed'
              ||
              row.status === 'Approved'
          )
          .length
    );

  readonly cancelledOnPage =
    computed(
      () =>
        this.rows()
          .filter(
            row =>
              row.status === 'Cancelled'
              ||
              row.status === 'Rejected'
          )
          .length
    );

  readonly firstResultNumber =
    computed(
      () =>
        this.pagination().totalItems
          ? (
            (
              this.pagination().pageNumber - 1
            ) *
            this.pagination().pageSize
          ) + 1
          : 0
    );

  readonly lastResultNumber =
    computed(
      () =>
        this.pagination().totalItems
          ? Math.min(
            this.firstResultNumber() +
            this.rows().length -
            1,
            this.pagination().totalItems
          )
          : 0
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
      .getAll({
        pageNumber:
          this.pagination().pageNumber,
        pageSize:
          this.pagination().pageSize,
        search:
          this.search().trim(),
        status:
          this.status(),
        sortBy:
          'createdAt',
        sortDirection:
          'desc'
      })
      .subscribe({
        next:
          response => {

            this.rows.set(
              response.items
            );

            this.pagination.set(
              response.pagination
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

            this.pagination.set(
              emptyPagination()
            );

            this.error.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'roomInspections.loadFailed'
                )
              )
            );

            this.loading.set(
              false
            );
          }
      });
  }

  applyFilters(): void {

    this.pagination.update(
      pagination => ({
        ...pagination,
        pageNumber: 1
      })
    );

    this.load();
  }

  clearFilters(): void {

    this.search.set(
      ''
    );

    this.status.set(
      ''
    );

    this.applyFilters();
  }

  previousPage(): void {

    if (
      !this.pagination().hasPreviousPage
    ) {
      return;
    }

    this.pagination.update(
      pagination => ({
        ...pagination,
        pageNumber:
          pagination.pageNumber - 1
      })
    );

    this.load();
  }

  nextPage(): void {

    if (
      !this.pagination().hasNextPage
    ) {
      return;
    }

    this.pagination.update(
      pagination => ({
        ...pagination,
        pageNumber:
          pagination.pageNumber + 1
      })
    );

    this.load();
  }

  openCreate(): void {

    if (
      !this.auth.hasPermission(
        'room-inspections.create'
      )
    ) {
      return;
    }

    this.editingId.set(
      null
    );

    this.form.set(
      this.createEmptyForm()
    );

    this.modalOpen.set(
      true
    );
  }

  openEdit(
    row: RoomInspection
  ): void {

    if (
      !this.auth.hasPermission(
        'room-inspections.update'
      )
    ) {
      return;
    }

    this.editingId.set(
      row.id
    );

    this.form.set({
      title:
        row.title,
      status:
        row.status,
      eventAtUtc:
        this.toLocalDateTime(
          new Date(
            row.eventAtUtc
          )
        ),
      notes:
        row.notes ?? '',
      amount:
        row.amount
    });

    this.modalOpen.set(
      true
    );
  }

  save(): void {

    const form =
      this.form();

    if (
      this.saving()
      ||
      !form.title.trim()
      ||
      !form.eventAtUtc
    ) {
      return;
    }

    this.saving.set(
      true
    );

    const id =
      this.editingId();

    const body = {
      title:
        form.title.trim(),
      notes:
        form.notes.trim() || null,
      amount:
        form.amount,
      eventAtUtc:
        new Date(
          form.eventAtUtc
        ).toISOString()
    };

    const request =
      id
        ? this.api.update(
          id,
          body
        )
        : this.api.create({
          ...body,
          status:
            form.status
        });

    request.subscribe({
      next:
        () => {

          this.toast.success(
            this.translation.translate(
              id
                ? 'roomInspections.updateSuccess'
                : 'roomInspections.createSuccess'
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
                id
                  ? 'roomInspections.updateFailed'
                  : 'roomInspections.createFailed'
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
    row: RoomInspection
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
          inspection => {

            this.detail.set(
              inspection
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
                  'roomInspections.loadOneFailed'
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

  changeStatus(
    row: RoomInspection,
    status: string
  ): void {

    if (
      this.mutatingId()
      ||
      !this.auth.hasPermission(
        'room-inspections.manage'
      )
      ||
      !status
      ||
      row.status === status
    ) {
      return;
    }

    this.mutatingId.set(
      row.id
    );

    this.api
      .changeStatus(
        row.id,
        status
      )
      .subscribe({
        next:
          () => {

            this.toast.success(
              this.translation.translate(
                'roomInspections.statusSuccess'
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
                  'roomInspections.statusFailed'
                )
              )
            );

            this.mutatingId.set(
              null
            );
          }
      });
  }

  remove(
    row: RoomInspection
  ): void {

    if (
      this.mutatingId()
      ||
      !this.auth.hasPermission(
        'room-inspections.delete'
      )
      ||
      !confirm(
        this.translation.translate(
          'roomInspections.deleteConfirm'
        )
      )
    ) {
      return;
    }

    this.mutatingId.set(
      row.id
    );

    this.api
      .delete(
        row.id
      )
      .subscribe({
        next:
          () => {

            this.toast.success(
              this.translation.translate(
                'roomInspections.deleteSuccess'
              )
            );

            this.mutatingId.set(
              null
            );

            if (
              this.rows().length === 1
              &&
              this.pagination().pageNumber > 1
            ) {
              this.pagination.update(
                pagination => ({
                  ...pagination,
                  pageNumber:
                    pagination.pageNumber - 1
                })
              );
            }

            this.load();
          },
        error:
          error => {

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'roomInspections.deleteFailed'
                )
              )
            );

            this.mutatingId.set(
              null
            );
          }
      });
  }

  updateForm(
    key: keyof RoomInspectionForm,
    value: string | number
  ): void {

    this.form.update(
      form => ({
        ...form,
        [key]:
          value
      })
    );
  }

  statusLabel(
    status: string
  ): string {

    return this.lookupLabel(
      'statuses',
      status
    );
  }

  statusClass(
    status: string
  ): string {

    const normalized =
      status.toLowerCase();

    if (
      normalized === 'completed'
      ||
      normalized === 'approved'
    ) {
      return 'status-badge status-badge--success';
    }

    if (
      normalized === 'cancelled'
      ||
      normalized === 'rejected'
    ) {
      return 'status-badge status-badge--danger';
    }

    if (
      normalized === 'inprogress'
    ) {
      return 'status-badge status-badge--info';
    }

    return 'status-badge status-badge--warning';
  }

  private createEmptyForm(): RoomInspectionForm {

    return {
      title: '',
      status: 'Open',
      eventAtUtc:
        this.toLocalDateTime(
          new Date()
        ),
      notes: '',
      amount: 0
    };
  }

  private toLocalDateTime(
    date: Date
  ): string {

    const local =
      new Date(
        date.getTime() -
        date.getTimezoneOffset() *
        60_000
      );

    return local
      .toISOString()
      .slice(
        0,
        16
      );
  }

  private lookupLabel(
    group: string,
    value: string
  ): string {

    const key =
      value
        .replace(
          /([a-z])([A-Z])/g,
          '$1-$2'
        )
        .replace(
          /-/g,
          ''
        )
        .toLowerCase();

    const translationKey =
      `roomInspections.${group}.${key}`;

    const translated =
      this.translation.translate(
        translationKey
      );

    return translated === translationKey
      ? value
      : translated;
  }

}
