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
  LucideBadgeDollarSign
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  UtilityRate
} from '../../models/utility-rate.model';

import {
  UtilityRatesApiService
} from '../../data-access/utility-rates-api.service';

@Component({
  selector:
    'app-rates-detail-page',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,
    TranslationPipe,
    LucideArrowLeft,
    LucidePencil,
    LucideBadgeDollarSign
  ],

  templateUrl:
    './rates-detail.page.html',

  styleUrl:
    './rates-detail.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class UtilityRateDetailPage {

  private readonly api =
    inject(UtilityRatesApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly item =
    signal<UtilityRate | null>(
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
              'UtilityRate detail API error',
              error
            );

            this.error.set(
              true
            );
          }
      });
  }
}
