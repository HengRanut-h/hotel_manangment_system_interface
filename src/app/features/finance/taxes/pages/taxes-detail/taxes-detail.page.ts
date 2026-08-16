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
  LucideBadgePercent,
  LucidePencil,
  LucideTrash2,
  LucidePower,
  LucideRotateCcw,
  LucideCalendarDays,
  LucideFileText
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  TranslationService
} from '../../../../../core/i18n/translation.service';

import {
  Tax
} from '../../models/tax.model';

import {
  TaxesApiService
} from '../../data-access/taxes-api.service';

import {
  TaxStatusBadgeComponent
} from '../../components/tax-status-badge/tax-status-badge.component';

import {
  TaxTypeBadgeComponent
} from '../../components/tax-type-badge/tax-type-badge.component';

@Component({
  selector:
    'app-taxes-detail-page',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,
    TranslationPipe,
    TaxStatusBadgeComponent,
    TaxTypeBadgeComponent,
    LucideArrowLeft,
    LucideBadgePercent,
    LucidePencil,
    LucideTrash2,
    LucidePower,
    LucideRotateCcw,
    LucideCalendarDays,
    LucideFileText
  ],

  templateUrl:
    './taxes-detail.page.html',

  styleUrl:
    './taxes-detail.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class TaxesDetailPage {

  private readonly api =
    inject(TaxesApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly translate =
    inject(TranslationService);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly tax =
    signal<Tax | null>(
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
        'taxes.errors.missingId'
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
            this.tax.set(
              value
            ),

        error:
          error => {

            console.error(
              'Tax detail API error',
              error
            );

            this.errorKey.set(
              'taxes.errors.loadDetail'
            );
          }
      });
  }

  toggleActive(): void {

    const item =
      this.tax();

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
              'Toggle tax active error',
              error
            );

            this.errorKey.set(
              'taxes.errors.toggleActive'
            );
          }
      });
  }

  deleteTax(): void {

    const item =
      this.tax();

    if (
      !item ||
      this.actionLoading()
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        this.translate.translate(
          'taxes.delete.confirm',
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
                '/app/finance/taxes'
              ]
            ),

        error:
          error => {

            console.error(
              'Delete tax error',
              error
            );

            this.errorKey.set(
              'taxes.errors.delete'
            );
          }
      });
  }

  restore(): void {

    const item =
      this.tax();

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
              'Restore tax error',
              error
            );

            this.errorKey.set(
              'taxes.errors.restore'
            );
          }
      });
  }
}
