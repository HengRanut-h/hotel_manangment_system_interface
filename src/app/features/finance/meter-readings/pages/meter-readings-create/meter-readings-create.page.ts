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
  LucideGauge
} from '@lucide/angular';

import {
  CreateMeterReadingRequest
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
    LucideGauge
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

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly meterId =
    this.route.snapshot
      .queryParamMap
      .get(
        'meterId'
      ) ??
    '';

  readonly submitting =
    signal(false);

  readonly error =
    signal(false);

  create(
    request:
      CreateMeterReadingRequest
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
          () =>
            this.router.navigate(
              [
                '/app/finance/meter-readings'
              ],
              {
                queryParams: {
                  meterId:
                    request.meterId
                }
              }
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
