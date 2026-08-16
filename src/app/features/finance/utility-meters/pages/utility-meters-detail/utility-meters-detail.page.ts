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
  Observable,
  finalize
} from 'rxjs';

import {
  takeUntilDestroyed
} from '@angular/core/rxjs-interop';

import {
  LucideArrowLeft,
  LucideGauge,
  LucidePencil,
  LucidePower,
  LucideTrash2,
  LucideRotateCcw,
  LucideMapPin,
  LucideActivity
} from '@lucide/angular';

import {
  UtilityMeter
} from '../../models/utility-meter.model';

import {
  UtilityMetersApiService
} from '../../data-access/utility-meters-api.service';

import {
  MeterStatusBadgeComponent
} from '../../components/meter-status-badge/meter-status-badge.component';

import {
  UtilityTypeBadgeComponent
} from '../../components/utility-type-badge/utility-type-badge.component';

@Component({
  selector:
    'app-utility-meters-detail-page',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,
    MeterStatusBadgeComponent,
    UtilityTypeBadgeComponent,
    LucideArrowLeft,
    LucideGauge,
    LucidePencil,
    LucidePower,
    LucideTrash2,
    LucideRotateCcw,
    LucideMapPin,
    LucideActivity
  ],

  templateUrl:
    './utility-meters-detail.page.html',

  styleUrl:
    './utility-meters-detail.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class UtilityMetersDetailPage {

  private readonly api =
    inject(UtilityMetersApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly item =
    signal<UtilityMeter | null>(
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
              'Utility meter detail error',
              error
            );

            this.error.set(
              true
            );
          }
      });
  }

  toggleActive(): void {

    const item =
      this.item();

    if (
      !item ||
      item.isDeleted
    ) {
      return;
    }

    this.runAction(
      this.api.setActive(
        item.id,
        !item.isActive
      )
    );
  }

  restore(): void {

    const item =
      this.item();

    if (
      !item
    ) {
      return;
    }

    this.runAction(
      this.api.restore(
        item.id
      )
    );
  }

  deleteItem(): void {

    const item =
      this.item();

    if (
      !item
    ) {
      return;
    }

    if (
      !window.confirm(
        `Delete meter "${item.meterNumber}"?`
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
                '/app/finance/utility-meters'
              ]
            ),

        error:
          error => {

            console.error(
              'Delete utility meter error',
              error
            );

            this.error.set(
              true
            );
          }
      });
  }

  private runAction(
    request: Observable<unknown>
  ): void {

    this.actionLoading.set(
      true
    );

    request
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
              'Utility meter action error',
              error
            );

            this.error.set(
              true
            );
          }
      });
  }
}
