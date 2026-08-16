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
  LucideSettings,
  LucidePencil,
  LucidePower,
  LucideTrash2,
  LucideRotateCcw,
  LucideRefreshCcw,
  LucideShieldCheck
} from '@lucide/angular';

import {
  SettingItem
} from '../../models/setting.model';

import {
  SettingsApiService
} from '../../data-access/settings-api.service';

import {
  SettingStatusBadgeComponent
} from '../../components/setting-status-badge/setting-status-badge.component';

import {
  SettingTypeBadgeComponent
} from '../../components/setting-type-badge/setting-type-badge.component';

import {
  SettingValueViewerComponent
} from '../../components/setting-value-viewer/setting-value-viewer.component';

@Component({
  selector:
    'app-settings-detail-page',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,

    SettingStatusBadgeComponent,
    SettingTypeBadgeComponent,
    SettingValueViewerComponent,

    LucideArrowLeft,
    LucideSettings,
    LucidePencil,
    LucidePower,
    LucideTrash2,
    LucideRotateCcw,
    LucideRefreshCcw,
  ],

  templateUrl:
    './settings-detail.page.html',

  styleUrl:
    './settings-detail.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class SettingsDetailPage {

  private readonly api =
    inject(SettingsApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly item =
    signal<SettingItem | null>(
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
              'Setting detail error',
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
      item.isDeleted ||
      item.isReadOnly
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

  reset(): void {

    const item =
      this.item();

    if (
      !item ||
      item.isReadOnly
    ) {
      return;
    }

    this.runAction(
      this.api.resetToDefault(
        item.id
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
      item.isReadOnly ||
      item.isSystem ||
      this.actionLoading()
    ) {
      return;
    }

    if (
      !window.confirm(
        `Delete setting "${item.name}"?`
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
                '/app/management/settings'
              ]
            ),

        error:
          error => {

            console.error(
              'Delete setting error',
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
              'Setting action error',
              error
            );

            this.error.set(
              true
            );
          }
      });
  }
}
