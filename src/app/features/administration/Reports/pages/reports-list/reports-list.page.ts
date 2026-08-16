import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal
} from '@angular/core';

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
  LucideChartNoAxesCombined,
  LucideSearch,
  LucideRefreshCw,
  LucideHistory,
  LucidePlay,
  LucideEye,
  LucideCircleCheck,
  LucideCircleX,
  LucideLayers3
} from '@lucide/angular';

import {
  ReportDefinition
} from '../../models/report.model';

import {
  ReportsApiService
} from '../../data-access/reports-api.service';

import {
  ReportCategoryBadgeComponent
} from '../../components/report-category-badge/report-category-badge.component';

@Component({
  selector:
    'app-reports-list-page',

  standalone:
    true,

  imports: [
    FormsModule,
    RouterLink,
    ReportCategoryBadgeComponent,

    LucideChartNoAxesCombined,
    LucideSearch,
    LucideRefreshCw,
    LucideHistory,
    LucidePlay,
    LucideEye,
    LucideCircleCheck,
    LucideCircleX,
    LucideLayers3
  ],

  templateUrl:
    './reports-list.page.html',

  styleUrl:
    './reports-list.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class ReportsListPage {

  private readonly api =
    inject(ReportsApiService);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly items =
    signal<ReportDefinition[]>([]);

  readonly loading =
    signal(false);

  readonly error =
    signal(false);

  readonly search =
    signal('');

  readonly category =
    signal('');

  readonly activeFilter =
    signal('');

  readonly pageNumber =
    signal(1);

  readonly pageSize =
    signal(20);

  readonly totalCount =
    signal(0);

  readonly totalPages =
    signal(1);

  readonly activeCount =
    computed(
      () =>
        this.items()
          .filter(
            item =>
              item.isActive !==
              false
          )
          .length
    );

  readonly inactiveCount =
    computed(
      () =>
        this.items()
          .filter(
            item =>
              item.isActive ===
              false
          )
          .length
    );

  readonly categoryCount =
    computed(
      () =>
        new Set(
          this.items()
            .map(
              item =>
                item.category
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

    const active =
      this.activeFilter();

    this.api
      .getDefinitions({
        pageNumber:
          this.pageNumber(),

        pageSize:
          this.pageSize(),

        search:
          this.search(),

        category:
          this.category(),

        isActive:
          active === ''
            ? undefined
            : active === 'true',

        sortBy:
          'name',

        sortDirection:
          'asc'
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
              'Reports list API error',
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

    this.category.set(
      ''
    );

    this.activeFilter.set(
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
}
