import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal
} from '@angular/core';

import {
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
  LucidePlus
} from '@lucide/angular';

import {
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
    'app-settings-create-page',

  standalone:
    true,

  imports: [
    RouterLink,
    SettingFormComponent,
    LucideArrowLeft,
    LucidePlus
  ],

  templateUrl:
    './settings-create.page.html',

  styleUrl:
    './settings-create.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class SettingsCreatePage {

  private readonly api =
    inject(SettingsApiService);

  private readonly router =
    inject(Router);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly submitting =
    signal(false);

  readonly error =
    signal(false);

  create(
    request:
      SettingUpsertRequest
  ): void {

    this.submitting.set(
      true
    );

    this.error.set(
      false
    );

    this.api
      .create(
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
          item =>
            this.router.navigate(
              [
                '/app/management/settings',
                item.id
              ]
            ),

        error:
          error => {

            console.error(
              'Create setting error',
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
      [
        '/app/management/settings'
      ]
    );
  }
}
