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
  LucideBarChart3,
  LucideSettings,
  LucideCircleCheck,
  LucideLockKeyhole,
  LucideShieldCheck
} from '@lucide/angular';

import {
  SettingItem
} from '../../models/setting.model';

import {
  SettingsApiService
} from '../../data-access/settings-api.service';

@Component({
  selector:
    'app-settings-analytics-page',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,
    LucideArrowLeft,
    LucideBarChart3,
    LucideSettings,
    LucideCircleCheck,
    LucideLockKeyhole,
    LucideShieldCheck
  ],

  templateUrl:
    './settings-analytics.page.html',

  styleUrl:
    './settings-analytics.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class SettingsAnalyticsPage {

  private readonly api =
    inject(SettingsApiService);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly items =
    signal<SettingItem[]>([]);

  readonly loading =
    signal(false);

  readonly total =
    computed(
      () =>
        this.items().length
    );

  readonly active =
    computed(
      () =>
        this.items()
          .filter(
            item =>
              item.isActive &&
              !item.isDeleted
          )
          .length
    );

  readonly sensitive =
    computed(
      () =>
        this.items()
          .filter(
            item =>
              item.isSensitive
          )
          .length
    );

  readonly system =
    computed(
      () =>
        this.items()
          .filter(
            item =>
              item.isSystem
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

    this.api
      .getAll({
        pageNumber:
          1,

        pageSize:
          1000,

        includeDeleted:
          false,

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
          result =>
            this.items.set(
              result.items ??
              []
            ),

        error:
          error =>
            console.error(
              'Settings analytics error',
              error
            )
      });
  }
}
