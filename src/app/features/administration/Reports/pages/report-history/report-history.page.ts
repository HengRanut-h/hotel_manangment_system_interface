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
  LucideArrowLeft,
  LucideHistory,
  LucideSearch,
  LucideRefreshCw,
  LucideEye,
  LucideDownload,
  LucideBan,
  LucideTrash2,
  LucideCircleCheck,
  LucideCircleX
} from '@lucide/angular';

import {
  ReportRun
} from '../../models/report.model';

import {
  ReportsApiService
} from '../../data-access/reports-api.service';

import {
  ReportStatusBadgeComponent
} from '../../components/report-status-badge/report-status-badge.component';

import {
  ReportCategoryBadgeComponent
} from '../../components/report-category-badge/report-category-badge.component';

@Component({
  selector:
    'app-report-history-page',

  standalone:
    true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ReportStatusBadgeComponent,
    ReportCategoryBadgeComponent,

    LucideArrowLeft,
    LucideHistory,
    LucideSearch,
    LucideRefreshCw,
    LucideEye,
    LucideDownload,
    LucideBan,
    LucideTrash2,
    LucideCircleCheck,
    LucideCircleX
  ],

  templateUrl:
    './report-history.page.html',

  styleUrl:
    './report-history.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class ReportHistoryPage {

  private readonly api =
    inject(ReportsApiService);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly items =
    signal<ReportRun[]>([]);

  readonly loading =
    signal(false);

  readonly actionId =
    signal<string | null>(
      null
    );

  readonly error =
    signal(false);

  readonly search =
    signal('');

  readonly status =
    signal('');

  readonly category =
    signal('');

  readonly pageNumber =
    signal(1);

  readonly pageSize =
    signal(20);

  readonly totalCount =
    signal(0);

  readonly totalPages =
    signal(1);

  readonly completedCount =
    computed(
      () =>
        this.items()
          .filter(
            item =>
              item.status ===
              'Completed'
          )
          .length
    );

  readonly failedCount =
    computed(
      () =>
        this.items()
          .filter(
            item =>
              item.status ===
              'Failed'
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

    this.error.set(
      false
    );

    this.api
      .getRuns({
        pageNumber:
          this.pageNumber(),

        pageSize:
          this.pageSize(),

        search:
          this.search(),

        status:
          this.status(),

        category:
          this.category(),

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
              'Report history API error',
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

    this.status.set(
      ''
    );

    this.category.set(
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

  cancelRun(
    item: ReportRun
  ): void {

    this.runAction(
      item,
      this.api.cancelRun(
        item.id
      )
    );
  }

  deleteRun(
    item: ReportRun
  ): void {

    if (
      !window.confirm(
        `Delete report run "${item.reportName || item.id}"?`
      )
    ) {
      return;
    }

    this.runAction(
      item,
      this.api.deleteRun(
        item.id
      )
    );
  }

  download(
    item: ReportRun
  ): void {

    if (
      this.actionId()
    ) {
      return;
    }

    this.actionId.set(
      item.id
    );

    this.api
      .downloadRun(
        item.id
      )
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
          blob => {

            const url =
              URL.createObjectURL(
                blob
              );

            const anchor =
              document.createElement(
                'a'
              );

            anchor.href =
              url;

            anchor.download =
              item.fileName ||
              `report-${item.id}`;

            anchor.click();

            URL.revokeObjectURL(
              url
            );
          },

        error:
          error =>
            console.error(
              'Report download error',
              error
            )
      });
  }

  private runAction(
    item: ReportRun,
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
          () =>
            this.load(),

        error:
          error =>
            console.error(
              'Report run action error',
              error
            )
      });
  }
}
