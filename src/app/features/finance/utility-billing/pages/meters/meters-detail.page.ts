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
  LucideGauge
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  UtilityMeter
} from '../../models/utility-meter.model';

import {
  UtilityMetersApiService
} from '../../data-access/utility-meters-api.service';

@Component({
  selector:
    'app-meters-detail-page',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,
    TranslationPipe,
    LucideArrowLeft,
    LucidePencil,
    LucideGauge
  ],

  templateUrl:
    './meters-detail.page.html',

  styleUrl:
    './meters-detail.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class UtilityMeterDetailPage {

  private readonly api =
    inject(UtilityMetersApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly item =
    signal<UtilityMeter | null>(
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
              'UtilityMeter detail API error',
              error
            );

            this.error.set(
              true
            );
          }
      });
  }
}
