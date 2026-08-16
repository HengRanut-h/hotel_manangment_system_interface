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
  FeatureFlag,
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
    'app-feature-flags-edit-page',

  standalone:
    true,

  imports: [
    RouterLink,
    FeatureFlagFormComponent,
    LucideArrowLeft,
    LucidePencil
  ],

  templateUrl:
    './feature-flags-edit.page.html',

  styleUrl:
    './feature-flags-edit.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class FeatureFlagsEditPage {

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
          item =>
            this.item.set(
              item
            ),

        error:
          error => {

            console.error(
              'Load feature flag edit error',
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
      FeatureFlagUpsertRequest
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
                '/app/management/feature-flags',
                this.id
              ]
            ),

        error:
          error => {

            console.error(
              'Update feature flag error',
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
            '/app/management/feature-flags',
            this.id
          ]
        : [
            '/app/management/feature-flags'
          ]
    );
  }
}
