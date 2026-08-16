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
  LucideBadgeDollarSign,
  LucidePencil,
  LucideTrash2,
  LucidePower,
  LucideRotateCcw,
  LucideCalendarDays
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  TranslationService
} from '../../../../../core/i18n/translation.service';

import {
  UtilityRate
} from '../../models/utility-rate.model';

import {
  UtilityRatesApiService
} from '../../data-access/utility-rates-api.service';

import {
  UtilityRateStatusBadgeComponent
} from '../../components/utility-rate-status-badge/utility-rate-status-badge.component';

import {
  UtilityTypeBadgeComponent
} from '../../components/utility-type-badge/utility-type-badge.component';

@Component({
  selector:
    'app-utility-rates-detail-page',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,
    TranslationPipe,
    UtilityRateStatusBadgeComponent,
    UtilityTypeBadgeComponent,
    LucideArrowLeft,
    LucideBadgeDollarSign,
    LucidePencil,
    LucideTrash2,
    LucidePower,
    LucideRotateCcw,
    LucideCalendarDays
  ],

  templateUrl:
    './utility-rates-detail.page.html',

  styleUrl:
    './utility-rates-detail.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class UtilityRatesDetailPage {

  private readonly api =
    inject(UtilityRatesApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly translate =
    inject(TranslationService);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly item =
    signal<UtilityRate | null>(
      null
    );

  readonly loading =
    signal(false);

  readonly actionLoading =
    signal(false);

  readonly errorKey =
    signal<string | null>(
      null
    );

  readonly id =
    this.route
      .snapshot
      .paramMap
      .get(
        'id'
      );

  constructor() {

    if (
      this.id
    ) {
      this.load();
    } else {
      this.errorKey.set(
        'utilityRates.errors.missingId'
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
              'Utility rate detail error',
              error
            );

            this.errorKey.set(
              'utilityRates.errors.loadDetail'
            );
          }
      });
  }

  toggleActive(): void {

    const item =
      this.item();

    if (
      !item ||
      item.isDeleted
    ) {
      return;
    }

    this.runAction(
      this.api.setActive(
        item.id,
        !item.isActive
      )
    );
  }

  restore(): void {

    const item =
      this.item();

    if (
      !item
    ) {
      return;
    }

    this.runAction(
      this.api.restore(
        item.id
      )
    );
  }

  deleteItem(): void {

    const item =
      this.item();

    if (
      !item
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        this.translate.translate(
          'utilityRates.delete.confirm',
          {
            name:
              item.name ||
              item.utilityName ||
              item.id
          }
        )
      );

    if (
      !confirmed
    ) {
      return;
    }

    this.actionLoading.set(
      true
    );

    this.api
      .delete(
        item.id
      )
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        ),

        finalize(
          () =>
            this.actionLoading.set(
              false
            )
        )
      )
      .subscribe({
        next:
          () =>
            this.router.navigate(
              [
                '/app/finance/utility-rates'
              ]
            ),

        error:
          error => {

            console.error(
              'Delete utility rate error',
              error
            );

            this.errorKey.set(
              'utilityRates.errors.delete'
            );
          }
      });
  }

  private runAction(
    request:
      import('rxjs').Observable<unknown>
  ): void {

    this.actionLoading.set(
      true
    );

    request
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        ),

        finalize(
          () =>
            this.actionLoading.set(
              false
            )
        )
      )
      .subscribe({
        next:
          () =>
            this.load(),

        error:
          error => {

            console.error(
              'Utility rate action error',
              error
            );

            this.errorKey.set(
              'utilityRates.errors.action'
            );
          }
      });
  }
}
