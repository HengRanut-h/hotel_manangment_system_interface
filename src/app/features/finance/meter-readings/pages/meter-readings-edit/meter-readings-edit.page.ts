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
  MeterReading,
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
    'app-meter-readings-edit-page',

  standalone:
    true,

  imports: [
    RouterLink,
    MeterReadingFormComponent,
    LucideArrowLeft,
    LucidePencil
  ],

  templateUrl:
    './meter-readings-edit.page.html',

  styleUrl:
    './meter-readings-edit.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class MeterReadingsEditPage {

  private readonly api =
    inject(MeterReadingsApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly item =
    signal<MeterReading | null>(
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
              'Load meter reading edit error',
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
      MeterReadingUpsertRequest
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
                '/app/finance/meter-readings',
                this.id
              ]
            ),

        error:
          error => {

            console.error(
              'Update meter reading error',
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
            '/app/finance/meter-readings',
            this.id
          ]
        : [
            '/app/finance/meter-readings'
          ]
    );
  }
}
