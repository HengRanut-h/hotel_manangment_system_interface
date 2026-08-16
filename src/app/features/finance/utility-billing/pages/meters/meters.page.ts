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
  FormsModule
} from '@angular/forms';

import {
  RouterLink
} from '@angular/router';

import {
  finalize
} from 'rxjs';

import {
  takeUntilDestroyed
} from '@angular/core/rxjs-interop';

import {
  LucideSearch,
  LucidePlus,
  LucideRefreshCw,
  LucideEye,
  LucidePencil,
  LucideTrash2,
  LucideGauge
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  TranslationService
} from '../../../../../core/i18n/translation.service';

import {
  UtilityMeter
} from '../../models/utility-meter.model';

import {
  UtilityMetersApiService
} from '../../data-access/utility-meters-api.service';

@Component({
  selector:
    'app-utilityBilling-pages-meters-page',

  standalone:
    true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    TranslationPipe,
    LucideSearch,
    LucidePlus,
    LucideRefreshCw,
    LucideEye,
    LucidePencil,
    LucideTrash2,
    LucideGauge
  ],

  templateUrl:
    './meters.page.html',

  styleUrl:
    './meters.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class UtilityMetersListPage {

  private readonly api =
    inject(UtilityMetersApiService);

  private readonly translate =
    inject(TranslationService);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly items =
    signal<UtilityMeter[]>([]);

  readonly loading =
    signal(false);

  readonly actionId =
    signal<string | null>(
      null
    );

  readonly error =
    signal(false);

  readonly search =
    signal('');

  readonly pageNumber =
    signal(1);

  readonly pageSize =
    signal(20);

  readonly totalCount =
    signal(0);

  readonly totalPages =
    signal(1);



  constructor() {
    this.load();
  }

  load(): void {

    this.loading.set(
      true
    );

    this.error.set(
      false
    );

    this.api
      .getAll({
        pageNumber:
          this.pageNumber(),

        pageSize:
          this.pageSize(),

        search:
          this.search()
      })
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
          result => {

            this.items.set(
              result.items ??
              []
            );

            this.totalCount.set(
              result.totalCount ??
              0
            );

            this.totalPages.set(
              Math.max(
                1,
                result.totalPages ??
                1
              )
            );
          },

        error:
          error => {

            console.error(
              'UtilityMeter list API error',
              error
            );

            this.items.set(
              []
            );

            this.error.set(
              true
            );
          }
      });
  }

  searchNow(): void {

    this.pageNumber.set(
      1
    );

    this.load();
  }

  clear(): void {

    this.search.set(
      ''
    );

    this.pageNumber.set(
      1
    );

    this.load();
  }

  changePage(
    page: number
  ): void {

    if (
      page < 1 ||
      page >
        this.totalPages()
    ) {
      return;
    }

    this.pageNumber.set(
      page
    );

    this.load();
  }

  deleteItem(
    item: UtilityMeter
  ): void {

    const confirmed =
      window.confirm(
        this.translate.translate(
          'utilityBilling.delete.confirm'
        )
      );

    if (
      !confirmed ||
      this.actionId()
    ) {
      return;
    }

    this.actionId.set(
      item.id
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
            this.actionId.set(
              null
            )
        )
      )
      .subscribe({
        next:
          () =>
            this.load(),

        error:
          error =>
            console.error(
              'Delete UtilityMeter error',
              error
            )
      });
  }
}
