import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal
} from '@angular/core';

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
  LucideChartNoAxesCombined,
  LucidePlay,
  LucideCalendarDays,
  LucideBuilding2,
  LucideFileDown
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
    'app-reports-detail-page',

  standalone:
    true,

  imports: [
    RouterLink,
    ReportCategoryBadgeComponent,
    LucideArrowLeft,
    LucideChartNoAxesCombined,
    LucidePlay,
    LucideCalendarDays,
    LucideBuilding2,
    LucideFileDown
  ],

  templateUrl:
    './reports-detail.page.html',

  styleUrl:
    './reports-detail.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class ReportsDetailPage {

  private readonly api =
    inject(ReportsApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly item =
    signal<ReportDefinition | null>(
      null
    );

  readonly loading =
    signal(false);

  readonly error =
    signal(false);

  readonly id =
    this.route.snapshot.paramMap.get(
      'id'
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

    this.api
      .getDefinitionById(
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
              'Report detail error',
              error
            );

            this.error.set(
              true
            );
          }
      });
  }
}
