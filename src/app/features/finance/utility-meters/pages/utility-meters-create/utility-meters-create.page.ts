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
    'app-utility-meters-create-page',

  standalone:
    true,

  imports: [
    RouterLink,
    UtilityMeterFormComponent,
    LucideArrowLeft,
    LucidePlus
  ],

  templateUrl:
    './utility-meters-create.page.html',

  styleUrl:
    './utility-meters-create.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class UtilityMetersCreatePage {

  private readonly api =
    inject(UtilityMetersApiService);

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
      UtilityMeterUpsertRequest
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
                '/app/finance/utility-meters',
                item.id
              ]
            ),

        error:
          error => {

            console.error(
              'Create utility meter error',
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
        '/app/finance/utility-meters'
      ]
    );
  }
}
