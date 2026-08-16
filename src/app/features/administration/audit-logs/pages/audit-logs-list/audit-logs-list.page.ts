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
  finalize
} from 'rxjs';

import {
  takeUntilDestroyed
} from '@angular/core/rxjs-interop';

import {
  LucideScrollText,
  LucideSearch,
  LucideRefreshCw,
  LucideDownload,
  LucideActivity,
  LucideCircleCheck,
  LucideCircleX,
  LucideUsers,
  LucideEye,
  LucideX
} from '@lucide/angular';

import {
  AuditLog,
  AuditLogSortField,
  SortDirection
} from '../../models/audit-log.model';

import {
  AuditLogsApiService
} from '../../data-access/audit-logs-api.service';

import {
  AuditActionBadgeComponent
} from '../../components/audit-action-badge/audit-action-badge.component';

import {
  AuditResultBadgeComponent
} from '../../components/audit-result-badge/audit-result-badge.component';

import {
  AuditJsonViewerComponent
} from '../../components/audit-json-viewer/audit-json-viewer.component';

@Component({
  selector:
    'app-audit-logs-list-page',

  standalone:
    true,

  imports: [
    CommonModule,
    FormsModule,

    AuditActionBadgeComponent,
    AuditResultBadgeComponent,
    AuditJsonViewerComponent,
    LucideScrollText,
    LucideSearch,
    LucideRefreshCw,
    LucideDownload,
    LucideActivity,
    LucideCircleCheck,
    LucideCircleX,
    LucideUsers,
    LucideEye,
    LucideX
  ],

  templateUrl:
    './audit-logs-list.page.html',

  styleUrl:
    './audit-logs-list.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class AuditLogsListPage {

  private readonly api =
    inject(AuditLogsApiService);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly items =
    signal<AuditLog[]>([]);

  readonly selected =
    signal<AuditLog | null>(
      null
    );

  readonly loading =
    signal(false);

  readonly error =
    signal(false);

  readonly search =
    signal('');

  readonly action =
    signal('');

  readonly entityName =
    signal('');

  readonly succeededFilter =
    signal('');

  readonly fromDate =
    signal('');

  readonly toDate =
    signal('');

  readonly pageNumber =
    signal(1);

  readonly pageSize =
    signal(20);

  readonly totalCount =
    signal(0);

  readonly totalPages =
    signal(1);

  readonly sortBy =
    signal<AuditLogSortField>(
      'createdAtUtc'
    );

  readonly sortDirection =
    signal<SortDirection>(
      'desc'
    );

  readonly successCount =
    computed(
      () =>
        this.items()
          .filter(
            item =>
              item.succeeded === true
          )
          .length
    );

  readonly failedCount =
    computed(
      () =>
        this.items()
          .filter(
            item =>
              item.succeeded === false
          )
          .length
    );

  readonly uniqueUsers =
    computed(
      () =>
        new Set(
          this.items()
            .map(
              item =>
                item.userId ||
                item.userEmail ||
                item.userName
            )
            .filter(
              Boolean
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

    const succeeded =
      this.succeededFilter();

    this.api
      .getAll({
        pageNumber:
          this.pageNumber(),

        pageSize:
          this.pageSize(),

        search:
          this.search(),

        action:
          this.action(),

        entityName:
          this.entityName(),

        succeeded:
          succeeded === ''
            ? undefined
            : succeeded === 'true',

        fromUtc:
          this.fromDate()
            ? new Date(
                `${this.fromDate()}T00:00:00`
              ).toISOString()
            : undefined,

        toUtc:
          this.toDate()
            ? new Date(
                `${this.toDate()}T23:59:59`
              ).toISOString()
            : undefined,

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
              'Audit logs API error',
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

    this.action.set(
      ''
    );

    this.entityName.set(
      ''
    );

    this.succeededFilter.set(
      ''
    );

    this.fromDate.set(
      ''
    );

    this.toDate.set(
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

  sort(
    field:
      AuditLogSortField
  ): void {

    if (
      this.sortBy() ===
      field
    ) {
      this.sortDirection.update(
        value =>
          value ===
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

    this.load();
  }

  sortIndicator(
    field:
      AuditLogSortField
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

  openDetail(
    item: AuditLog
  ): void {

    this.selected.set(
      item
    );
  }

  closeDetail(): void {

    this.selected.set(
      null
    );
  }

  exportCsv(): void {

    const rows =
      this.items();

    if (
      rows.length ===
      0
    ) {
      return;
    }

    const header =
    [
      'Id',
      'CreatedAtUtc',
      'User',
      'Action',
      'EntityName',
      'EntityId',
      'Module',
      'Succeeded',
      'IpAddress',
      'CorrelationId',
      'Description'
    ];

    const csvRows =
    [
      header,
      ...rows.map(
        item =>
        [
          item.id,
          item.createdAtUtc,
          item.userEmail ||
            item.userName ||
            item.userId ||
            '',
          item.action,
          item.entityName ||
            '',
          item.entityId ||
            '',
          item.module ||
            '',
          item.succeeded === null ||
          item.succeeded === undefined
            ? ''
            : String(
                item.succeeded
              ),
          item.ipAddress ||
            '',
          item.correlationId ||
            '',
          item.description ||
            ''
        ]
      )
    ];

    const csv =
      csvRows
        .map(
          row =>
            row
              .map(
                value =>
                  `"${String(
                    value
                  ).replace(
                    /"/g,
                    '""'
                  )}"`
              )
              .join(',')
        )
        .join('\r\n');

    const blob =
      new Blob(
        [
          csv
        ],
        {
          type:
            'text/csv;charset=utf-8'
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        'a'
      );

    link.href =
      url;

    link.download =
      `audit-logs-page-${this.pageNumber()}.csv`;

    link.click();

    URL.revokeObjectURL(
      url
    );
  }
}
