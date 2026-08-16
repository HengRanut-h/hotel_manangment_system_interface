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
  MeterReadingUpsertRequest
} from '../../models/meter-reading.model';

import {
  MeterReadingsApiService
} from '../../data-access/meter-readings-api.service';

import {
  MeterReadingFormComponent
} from '../../components/meter-reading-form/meter-reading-form.component';

@Component({
  selector:
    'app-meter-readings-create-page',

  standalone:
    true,

  imports: [
    RouterLink,
    MeterReadingFormComponent,
    LucideArrowLeft,
    LucidePlus
  ],

  templateUrl:
    './meter-readings-create.page.html',

  styleUrl:
    './meter-readings-create.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class MeterReadingsCreatePage {

  private readonly api =
    inject(MeterReadingsApiService);

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
      MeterReadingUpsertRequest
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
                '/app/finance/meter-readings',
                item.id
              ]
            ),

        error:
          error => {

            console.error(
              'Create meter reading error',
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
        '/app/finance/meter-readings'
      ]
    );
  }
}
