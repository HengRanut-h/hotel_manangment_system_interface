import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ActivatedRoute,
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
  LucidePencil,
  LucideActivity
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  MeterReading
} from '../../models/meter-reading.model';

import {
  MeterReadingsApiService
} from '../../data-access/meter-readings-api.service';

@Component({
  selector:
    'app-readings-detail-page',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,
    TranslationPipe,
    LucideArrowLeft,
    LucidePencil,
    LucideActivity
  ],

  templateUrl:
    './readings-detail.page.html',

  styleUrl:
    './readings-detail.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class MeterReadingDetailPage {

  private readonly api =
    inject(MeterReadingsApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly item =
    signal<MeterReading | null>(
      null
    );

  readonly loading =
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
    }
  }

  load(): void {

    if (
      !this.id
    ) {
      this.error.set(
        true
      );

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
          value =>
            this.item.set(
              value
            ),

        error:
          error => {

            console.error(
              'MeterReading detail API error',
              error
            );

            this.error.set(
              true
            );
          }
      });
  }
}
