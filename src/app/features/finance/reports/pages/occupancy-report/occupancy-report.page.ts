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
  LucideBedDouble,
  LucideRefreshCw,
  LucideSearch,
  LucideHotel,
  LucideBedSingle,
  LucidePercent,
  LucideCalendarDays
} from '@lucide/angular';

import {
  OccupancyReport
} from '../../models/report.model';

import {
  ReportsApiService
} from '../../data-access/reports-api.service';

@Component({
  selector:
    'app-occupancy-report-page',

  standalone:
    true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink,

    LucideArrowLeft,
    LucideBedDouble,
    LucideRefreshCw,
    LucideSearch,
    LucideHotel,
    LucideBedSingle,
    LucidePercent,
    LucideCalendarDays
  ],

  templateUrl:
    './occupancy-report.page.html',

  styleUrl:
    './occupancy-report.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class OccupancyReportPage {

  private readonly api =
    inject(ReportsApiService);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly date =
    signal(
      this.today()
    );

  readonly data =
    signal<OccupancyReport | null>(
      null
    );

  readonly loading =
    signal(false);

  readonly error =
    signal(false);

  constructor() {
    this.load();
  }

  load(): void {

    const date =
      this.date();

    if (
      !date
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
      .getOccupancy({
        date
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
          data =>
            this.data.set(
              data
            ),

        error:
          error => {

            console.error(
              'Occupancy report API error',
              error
            );

            this.error.set(
              true
            );
          }
      });
  }

  private today(): string {

    const date =
      new Date();

    const local =
      new Date(
        date.getTime() -
        date.getTimezoneOffset() *
        60000
      );

    return local
      .toISOString()
      .slice(
        0,
        10
      );
  }
}
