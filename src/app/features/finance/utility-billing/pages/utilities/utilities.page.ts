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
  LucideZap
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  TranslationService
} from '../../../../../core/i18n/translation.service';

import {
  Utility
} from '../../models/utility.model';

import {
  UtilityTypeBadgeComponent
} from '../../components/utility-type-badge/utility-type-badge.component';

import {
  ActiveStatusBadgeComponent
} from '../../components/active-status-badge/active-status-badge.component';

import {
  UtilitiesApiService
} from '../../data-access/utilities-api.service';

@Component({
  selector:
    'app-utilityBilling-pages-utilities-page',

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
    LucideZap,
    UtilityTypeBadgeComponent,
    ActiveStatusBadgeComponent
  ],

  templateUrl:
    './utilities.page.html',

  styleUrl:
    './utilities.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class UtilitiesListPage {

  private readonly api =
    inject(UtilitiesApiService);

  private readonly translate =
    inject(TranslationService);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly items =
    signal<Utility[]>([]);

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
              'Utility list API error',
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
    item: Utility
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
              'Delete Utility error',
              error
            )
      });
  }
}
