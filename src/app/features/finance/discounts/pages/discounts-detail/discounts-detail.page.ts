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
  LucideTicketPercent,
  LucidePencil,
  LucideTrash2,
  LucidePower,
  LucideRotateCcw,
  LucideCalendarDays,
  LucideGauge,
  LucideFileText
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  TranslationService
} from '../../../../../core/i18n/translation.service';

import {
  Discount
} from '../../models/discount.model';

import {
  DiscountsApiService
} from '../../data-access/discounts-api.service';

import {
  DiscountStatusBadgeComponent
} from '../../components/discount-status-badge/discount-status-badge.component';

import {
  DiscountTypeBadgeComponent
} from '../../components/discount-type-badge/discount-type-badge.component';

@Component({
  selector:
    'app-discounts-detail-page',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,
    TranslationPipe,
    DiscountStatusBadgeComponent,
    DiscountTypeBadgeComponent,
    LucideArrowLeft,
    LucideTicketPercent,
    LucidePencil,
    LucideTrash2,
    LucidePower,
    LucideRotateCcw,
    LucideCalendarDays,
    LucideGauge,
    LucideFileText
  ],

  templateUrl:
    './discounts-detail.page.html',

  styleUrl:
    './discounts-detail.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class DiscountsDetailPage {

  private readonly api =
    inject(DiscountsApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly translate =
    inject(TranslationService);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly discount =
    signal<Discount | null>(
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
      !this.id
    ) {
      this.errorKey.set(
        'discounts.errors.missingId'
      );

      return;
    }

    this.load();
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

    this.errorKey.set(
      null
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
            this.discount.set(
              value
            ),

        error:
          error => {

            console.error(
              'Discount detail API error',
              error
            );

            this.errorKey.set(
              'discounts.errors.loadDetail'
            );
          }
      });
  }

  toggleActive(): void {

    const item =
      this.discount();

    if (
      !item ||
      item.isDeleted ||
      this.actionLoading()
    ) {
      return;
    }

    this.actionLoading.set(
      true
    );

    this.api
      .setActive(
        item.id,
        !item.isActive
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
            this.load(),

        error:
          error => {

            console.error(
              'Toggle active error',
              error
            );

            this.errorKey.set(
              'discounts.errors.toggleActive'
            );
          }
      });
  }

  deleteDiscount(): void {

    const item =
      this.discount();

    if (
      !item ||
      this.actionLoading()
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        this.translate.translate(
          'discounts.delete.confirm',
          {
            name:
              item.name
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
                '/app/finance/discounts'
              ]
            ),

        error:
          error => {

            console.error(
              'Delete discount error',
              error
            );

            this.errorKey.set(
              'discounts.errors.delete'
            );
          }
      });
  }

  restore(): void {

    const item =
      this.discount();

    if (
      !item ||
      this.actionLoading()
    ) {
      return;
    }

    this.actionLoading.set(
      true
    );

    this.api
      .restore(
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
            this.load(),

        error:
          error => {

            console.error(
              'Restore discount error',
              error
            );

            this.errorKey.set(
              'discounts.errors.restore'
            );
          }
      });
  }
}
