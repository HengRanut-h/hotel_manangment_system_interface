import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal
} from '@angular/core';

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
  LucidePencil
} from '@lucide/angular';

import {
  SettingItem,
  SettingUpsertRequest
} from '../../models/setting.model';

import {
  SettingsApiService
} from '../../data-access/settings-api.service';

import {
  SettingFormComponent
} from '../../components/setting-form/setting-form.component';

@Component({
  selector:
    'app-settings-edit-page',

  standalone:
    true,

  imports: [
    RouterLink,
    SettingFormComponent,
    LucideArrowLeft,
    LucidePencil
  ],

  templateUrl:
    './settings-edit.page.html',

  styleUrl:
    './settings-edit.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class SettingsEditPage {

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

  readonly submitting =
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
          item => {

            if (
              item.isReadOnly
            ) {
              this.router.navigate(
                [
                  '/app/management/settings',
                  item.id
                ]
              );

              return;
            }

            this.item.set(
              item
            );
          },

        error:
          error => {

            console.error(
              'Load setting edit error',
              error
            );

            this.error.set(
              true
            );
          }
      });
  }

  update(
    request:
      SettingUpsertRequest
  ): void {

    if (
      !this.id
    ) {
      return;
    }

    this.submitting.set(
      true
    );

    this.api
      .update(
        this.id,
        request
      )
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        ),

        finalize(
          () =>
            this.submitting.set(
              false
            )
        )
      )
      .subscribe({
        next:
          () =>
            this.router.navigate(
              [
                '/app/management/settings',
                this.id
              ]
            ),

        error:
          error => {

            console.error(
              'Update setting error',
              error
            );

            this.error.set(
              true
            );
          }
      });
  }

  cancel(): void {

    this.router.navigate(
      this.id
        ? [
            '/app/management/settings',
            this.id
          ]
        : [
            '/app/management/settings'
          ]
    );
  }
}
