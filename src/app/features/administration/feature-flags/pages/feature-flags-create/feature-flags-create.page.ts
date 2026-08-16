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
  FeatureFlagUpsertRequest
} from '../../models/feature-flag.model';

import {
  FeatureFlagsApiService
} from '../../data-access/feature-flags-api.service';

import {
  FeatureFlagFormComponent
} from '../../components/feature-flag-form/feature-flag-form.component';

@Component({
  selector:
    'app-feature-flags-create-page',

  standalone:
    true,

  imports: [
    RouterLink,
    FeatureFlagFormComponent,
    LucideArrowLeft,
    LucidePlus
  ],

  templateUrl:
    './feature-flags-create.page.html',

  styleUrl:
    './feature-flags-create.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class FeatureFlagsCreatePage {

  private readonly api =
    inject(FeatureFlagsApiService);

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
      FeatureFlagUpsertRequest
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
                '/app/management/feature-flags',
                item.id
              ]
            ),

        error:
          error => {

            console.error(
              'Create feature flag error',
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
        '/app/management/feature-flags'
      ]
    );
  }
}
