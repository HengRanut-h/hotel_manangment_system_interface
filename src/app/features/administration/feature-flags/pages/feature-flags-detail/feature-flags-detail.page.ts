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
  LucideFlag,
  LucidePencil,
  LucidePower,
  LucideTrash2,
  LucideRotateCcw,
  LucideCalendarDays,
  LucideGauge
} from '@lucide/angular';

import {
  FeatureFlag
} from '../../models/feature-flag.model';

import {
  FeatureFlagsApiService
} from '../../data-access/feature-flags-api.service';

import {
  FeatureFlagStatusBadgeComponent
} from '../../components/feature-flag-status-badge/feature-flag-status-badge.component';

import {
  EnvironmentBadgeComponent
} from '../../components/environment-badge/environment-badge.component';

import {
  JsonViewerComponent
} from '../../components/json-viewer/json-viewer.component';

@Component({
  selector:
    'app-feature-flags-detail-page',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,

    FeatureFlagStatusBadgeComponent,
    EnvironmentBadgeComponent,
    JsonViewerComponent,

    LucideArrowLeft,
    LucideFlag,
    LucidePencil,
    LucidePower,
    LucideTrash2,
    LucideRotateCcw,
    LucideCalendarDays,
    LucideGauge
  ],

  templateUrl:
    './feature-flags-detail.page.html',

  styleUrl:
    './feature-flags-detail.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class FeatureFlagsDetailPage {

  private readonly api =
    inject(FeatureFlagsApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly item =
    signal<FeatureFlag | null>(
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
              'Feature flag detail error',
              error
            );

            this.error.set(
              true
            );
          }
      });
  }

  toggleEnabled(): void {

    const item =
      this.item();

    if (
      !item ||
      item.isDeleted
    ) {
      return;
    }

    this.runAction(
      this.api.setEnabled(
        item.id,
        !item.isEnabled
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
      !item ||
      this.actionLoading()
    ) {
      return;
    }

    if (
      !window.confirm(
        `Delete feature flag "${item.name}"?`
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
                '/app/management/feature-flags'
              ]
            ),

        error:
          error => {

            console.error(
              'Delete feature flag error',
              error
            );

            this.error.set(
              true
            );
          }
      });
  }

  private runAction(
    request:
      Observable<unknown>
  ): void {

    if (
      this.actionLoading()
    ) {
      return;
    }

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
              'Feature flag action error',
              error
            );

            this.error.set(
              true
            );
          }
      });
  }
}
