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
  UtilityMeter,
  UtilityMeterUpsertRequest
} from '../../models/utility-meter.model';

import {
  UtilityMetersApiService
} from '../../data-access/utility-meters-api.service';

import {
  UtilityMeterFormComponent
} from '../../components/utility-meter-form/utility-meter-form.component';

@Component({
  selector:
    'app-utility-meters-edit-page',

  standalone:
    true,

  imports: [
    RouterLink,
    UtilityMeterFormComponent,
    LucideArrowLeft,
    LucidePencil
  ],

  templateUrl:
    './utility-meters-edit.page.html',

  styleUrl:
    './utility-meters-edit.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class UtilityMetersEditPage {

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
              'Load utility meter edit error',
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
      UtilityMeterUpsertRequest
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
                '/app/finance/utility-meters',
                this.id
              ]
            ),

        error:
          error => {

            console.error(
              'Update utility meter error',
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
            '/app/finance/utility-meters',
            this.id
          ]
        : [
            '/app/finance/utility-meters'
          ]
    );
  }
}
