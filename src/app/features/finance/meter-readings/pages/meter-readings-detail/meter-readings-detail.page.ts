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
  Router,
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
  LucideActivity,
  LucidePencil,
  LucideTrash2,
  LucideRotateCcw,
  LucideGauge,
  LucideCircleDollarSign,
  LucideCalendarDays
} from '@lucide/angular';

import {
  MeterReading
} from '../../models/meter-reading.model';

import {
  MeterReadingsApiService
} from '../../data-access/meter-readings-api.service';

import {
  ReadingStatusBadgeComponent
} from '../../components/reading-status-badge/reading-status-badge.component';

import {
  UtilityTypeBadgeComponent
} from '../../components/utility-type-badge/utility-type-badge.component';

@Component({
  selector:
    'app-meter-readings-detail-page',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,

    ReadingStatusBadgeComponent,
    UtilityTypeBadgeComponent,

    LucideArrowLeft,
    LucideActivity,
    LucidePencil,
    LucideTrash2,
    LucideRotateCcw,
    LucideGauge,
    LucideCircleDollarSign,
    LucideCalendarDays
  ],

  templateUrl:
    './meter-readings-detail.page.html',

  styleUrl:
    './meter-readings-detail.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class MeterReadingsDetailPage {

  private readonly api =
    inject(MeterReadingsApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly item =
    signal<MeterReading | null>(
      null
    );

  readonly loading =
    signal(false);

  readonly actionLoading =
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

    this.error.set(
      false
    );

    this.api
      .getById(
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
              'Meter reading detail error',
              error
            );

            this.error.set(
              true
            );
          }
      });
  }

  deleteItem(): void {

    const item =
      this.item();

    if (
      !item ||
      this.actionLoading()
    ) {
      return;
    }

    if (
      !window.confirm(
        `Delete reading for meter "${item.meterNumber || item.meterId}"?`
      )
    ) {
      return;
    }

    this.actionLoading.set(
      true
    );

    this.api
      .delete(
        item.id
      )
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        ),

        finalize(
          () =>
            this.actionLoading.set(
              false
            )
        )
      )
      .subscribe({
        next:
          () =>
            this.router.navigate(
              [
                '/app/finance/meter-readings'
              ]
            ),

        error:
          error => {

            console.error(
              'Delete meter reading error',
              error
            );

            this.error.set(
              true
            );
          }
      });
  }

  restore(): void {

    const item =
      this.item();

    if (
      !item ||
      this.actionLoading()
    ) {
      return;
    }

    this.actionLoading.set(
      true
    );

    this.api
      .restore(
        item.id
      )
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        ),

        finalize(
          () =>
            this.actionLoading.set(
              false
            )
        )
      )
      .subscribe({
        next:
          () =>
            this.load(),

        error:
          error => {

            console.error(
              'Restore meter reading error',
              error
            );

            this.error.set(
              true
            );
          }
      });
  }
}
