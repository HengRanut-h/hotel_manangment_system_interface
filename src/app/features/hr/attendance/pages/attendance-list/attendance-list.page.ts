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
  RouterLink
} from '@angular/router';

import {
  LucideCalendarCheck,
  LucideChevronLeft,
  LucideChevronRight,
  LucideCircleCheck,
  LucideClock,
  LucideEye,
  LucideFilter,
  LucidePencil,
  LucidePlus,
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
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  TranslationService
} from '../../../../../core/i18n/translation.service';

import {
  SpinComponent
} from '../../../../../shared/ui/spin/spin.component';

import {
  ToastService
} from '../../../../../shared/ui/toast/toast.service';

import {
  AttendanceApiService
} from '../../data-access/attendance-api.service';

import {
  AttendanceQuery,
  AttendanceRecord
} from '../../models/attendance.model';

type AttendanceSortField =
  | 'createdAt'
  | 'reference'
  | 'title'
  | 'status'
  | 'amount'
  | 'eventAt';

type SortDirection =
  | 'asc'
  | 'desc';

@Component({
  selector: 'app-attendance-list.page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    DatePipe,
    TranslationPipe,
    SpinComponent,
    LucideCalendarCheck,
    LucideChevronLeft,
    LucideChevronRight,
    LucideCircleCheck,
    LucideClock,
    LucideEye,
    LucideFilter,
    LucidePencil,
    LucidePlus,
    LucideRotateCcw,
    LucideSearch,
    LucideTrash2
  ],
  templateUrl: './attendance-list.page.html',
  styleUrl: './attendance-list.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttendanceListPage
  implements OnInit {

  readonly auth =
    inject(
      AuthStore
    );

  private readonly api =
    inject(
      AttendanceApiService
    );

  private readonly toast =
    inject(
      ToastService
    );

  private readonly translation =
    inject(
      TranslationService
    );

  readonly records =
    signal<AttendanceRecord[]>(
      []
    );

  readonly loading =
    signal(
      true
    );

  readonly error =
    signal(
      ''
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

  readonly sortBy =
    signal<AttendanceSortField>(
      'createdAt'
    );

  readonly sortDirection =
    signal<SortDirection>(
      'desc'
    );

  readonly pageNumber =
    signal(
      1
    );

  readonly pageSize =
    signal(
      20
    );

  readonly totalCount =
    signal(
      0
    );

  readonly totalPages =
    signal(
      1
    );

  readonly hasPreviousPage =
    signal(
      false
    );

  readonly hasNextPage =
    signal(
      false
    );

  readonly openOnPage =
    computed(
      () =>
        this.records()
          .filter(
            record =>
              record.status.toLowerCase() === 'open'
          )
          .length
    );

  readonly completedOnPage =
    computed(
      () =>
        this.records()
          .filter(
            record =>
              record.status.toLowerCase() === 'completed'
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

    const query:
      AttendanceQuery = {
      search:
        this.search()
          .trim(),
      status:
        this.status()
          .trim()
        || null,
      sortBy:
        this.sortBy(),
      sortDirection:
        this.sortDirection(),
      pageNumber:
        this.pageNumber(),
      pageSize:
        this.pageSize()
    };

    this.api
      .getPage(
        query
      )
      .subscribe({
        next:
          result => {

            this.records.set(
              result.items
            );

            this.pageNumber.set(
              result.pageNumber
            );

            this.pageSize.set(
              result.pageSize
            );

            this.totalCount.set(
              result.totalItems
            );

            this.totalPages.set(
              Math.max(
                1,
                result.totalPages
              )
            );

            this.hasPreviousPage.set(
              result.hasPreviousPage
            );

            this.hasNextPage.set(
              result.hasNextPage
            );

            this.loading.set(
              false
            );
          },
        error:
          error => {

            this.records.set(
              []
            );

            this.totalCount.set(
              0
            );

            this.totalPages.set(
              1
            );

            this.hasPreviousPage.set(
              false
            );

            this.hasNextPage.set(
              false
            );

            this.error.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'attendance.loadFailed'
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

    this.pageNumber.set(
      1
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

    this.sortBy.set(
      'createdAt'
    );

    this.sortDirection.set(
      'desc'
    );

    this.pageNumber.set(
      1
    );

    this.load();
  }

  previousPage(): void {

    if (
      this.loading()
      ||
      !this.hasPreviousPage()
    ) {
      return;
    }

    this.pageNumber.update(
      value =>
        value - 1
    );

    this.load();
  }

  nextPage(): void {

    if (
      this.loading()
      ||
      !this.hasNextPage()
    ) {
      return;
    }

    this.pageNumber.update(
      value =>
        value + 1
    );

    this.load();
  }

  changeStatus(
    record: AttendanceRecord,
    event: Event
  ): void {

    const status =
      (
        event.target as HTMLSelectElement
      ).value
        .trim();

    if (
      !status
      ||
      status === record.status
      ||
      this.mutatingId()
    ) {
      return;
    }

    this.mutatingId.set(
      record.id
    );

    this.api
      .changeStatus(
        record.id,
        status
      )
      .subscribe({
        next:
          updated => {

            this.records.update(
              records =>
                records.map(
                  item =>
                    item.id === updated.id
                      ? updated
                      : item
                )
            );

            this.toast.success(
              this.translation.translate(
                'attendance.statusChangeSuccess'
              )
            );

            this.mutatingId.set(
              null
            );
          },
        error:
          error => {

            (
              event.target as HTMLSelectElement
            ).value =
              record.status;

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'attendance.statusChangeFailed'
                )
              )
            );

            this.mutatingId.set(
              null
            );
          }
      });
  }

  deleteRecord(
    record: AttendanceRecord
  ): void {

    if (
      this.mutatingId()
    ) {
      return;
    }

    const message =
      this.translation.translate(
        'attendance.deleteConfirm',
        {
          reference:
            record.referenceNumber
        }
      );

    if (
      !window.confirm(
        message
      )
    ) {
      return;
    }

    this.mutatingId.set(
      record.id
    );

    this.api
      .delete(
        record.id
      )
      .subscribe({
        next:
          () => {

            this.toast.success(
              this.translation.translate(
                'attendance.deleteSuccess'
              )
            );

            this.mutatingId.set(
              null
            );

            if (
              this.records().length === 1
              &&
              this.pageNumber() > 1
            ) {
              this.pageNumber.update(
                value =>
                  value - 1
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
                  'attendance.deleteFailed'
                )
              )
            );

            this.mutatingId.set(
              null
            );
          }
      });
  }

  statusClass(
    status: string
  ): string {

    const normalized =
      status.toLowerCase();

    if (
      normalized === 'completed' ||
      normalized === 'approved'
    ) {
      return 'status-badge status-badge--active';
    }

    if (
      normalized === 'rejected' ||
      normalized === 'cancelled'
    ) {
      return 'status-badge status-badge--inactive';
    }

    return 'status-badge status-badge--warning';
  }

}
