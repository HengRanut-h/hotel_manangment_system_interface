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
  LucideFileChartColumn,
  LucideDownload,
  LucideRefreshCw
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
    'app-report-run-detail-page',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,
    ReportStatusBadgeComponent,
    ReportCategoryBadgeComponent,
    LucideArrowLeft,
    LucideFileChartColumn,
    LucideDownload,
    LucideRefreshCw
  ],

  templateUrl:
    './report-run-detail.page.html',

  styleUrl:
    './report-run-detail.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class ReportRunDetailPage {

  private readonly api =
    inject(ReportsApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly item =
    signal<ReportRun | null>(
      null
    );

  readonly loading =
    signal(false);

  readonly downloading =
    signal(false);

  readonly error =
    signal(false);

  readonly id =
    this.route.snapshot.paramMap.get(
      'runId'
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
      .getRunById(
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
          item =>
            this.item.set(
              item
            ),

        error:
          error => {

            console.error(
              'Report run detail error',
              error
            );

            this.error.set(
              true
            );
          }
      });
  }

  download(): void {

    const item =
      this.item();

    if (
      !item ||
      this.downloading()
    ) {
      return;
    }

    this.downloading.set(
      true
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
            this.downloading.set(
              false
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
}
