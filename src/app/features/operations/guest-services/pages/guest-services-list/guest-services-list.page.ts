import {
  DatePipe
} from '@angular/common';

import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';

import {
  RouterLink
} from '@angular/router';

import {
  LucideChevronLeft,
  LucideChevronRight,
  LucideCirclePlus,
  LucideEye,
  LucidePencil,
  LucideRefreshCw,
  LucideSearch,
  LucideTrash2,
  LucideX
} from '@lucide/angular';

import {
  AuthStore
} from '../../../../../core/auth/auth.store';

import {
  getSafeApiErrorMessage
} from '../../../../../core/http/api-error.util';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  TranslationService
} from '../../../../../core/i18n/translation.service';

import {
  SpinComponent
} from '../../../../../shared/ui/spin/spin.component';

import {
  ToastService
} from '../../../../../shared/ui/toast/toast.service';

import {
  GuestServicesApiService
} from '../../data-access/guest-services-api.service';

import {
  GuestService
} from '../../models/guest-services.model';


@Component({
  selector:
    'app-guest-services-list-page',

  standalone:
    true,

  imports: [
    DatePipe,
    RouterLink,
    TranslationPipe,
    SpinComponent,

    LucideChevronLeft,
    LucideChevronRight,
    LucideCirclePlus,
    LucideEye,
    LucidePencil,
    LucideRefreshCw,
    LucideSearch,
    LucideTrash2,
    LucideX
  ],

  templateUrl:
    './guest-services-list.page.html',

  styleUrl:
    './guest-services-list.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class GuestServicesListPage
  implements OnInit {

  // =========================================================
  // SERVICES
  // =========================================================

  readonly auth =
    inject(AuthStore);

  private readonly api =
    inject(GuestServicesApiService);

  private readonly translation =
    inject(TranslationService);

  private readonly toast =
    inject(ToastService);


  // =========================================================
  // DATA
  // =========================================================

  readonly items =
    signal<GuestService[]>([]);


  // =========================================================
  // REQUEST STATE
  // =========================================================

  readonly loading =
    signal(true);

  readonly errorMessage =
    signal('');


  // =========================================================
  // FILTERS
  // =========================================================

  readonly search =
    signal('');

  readonly isActiveFilter =
    signal<boolean | null>(
      null
    );


  // =========================================================
  // PAGINATION
  // =========================================================

  readonly pageNumber =
    signal(1);

  readonly pageSize =
    signal(20);

  readonly totalItems =
    signal(0);


  // =========================================================
  // DELETE STATE
  // =========================================================

  readonly deletingId =
    signal<string | null>(
      null
    );

  readonly deleteTarget =
    signal<GuestService | null>(
      null
    );


  // =========================================================
  // SUMMARY
  // =========================================================

  readonly activeOnPage =
    computed(
      () =>
        this.items()
          .filter(
            item =>
              item.isActive
          )
          .length
    );

  readonly inactiveOnPage =
    computed(
      () =>
        this.items()
          .filter(
            item =>
              !item.isActive
          )
          .length
    );


  // =========================================================
  // PAGINATION COMPUTED
  // =========================================================

  readonly totalPages =
    computed(
      () =>
        Math.max(
          1,
          Math.ceil(
            this.totalItems()
            /
            this.pageSize()
          )
        )
    );

  readonly hasPreviousPage =
    computed(
      () =>
        this.pageNumber() > 1
    );

  readonly hasNextPage =
    computed(
      () =>
        this.pageNumber()
        <
        this.totalPages()
    );

  readonly firstItemNumber =
    computed(
      () => {

        if (
          this.totalItems() === 0
        ) {
          return 0;
        }

        return (
          (
            this.pageNumber() - 1
          )
          *
          this.pageSize()
        )
        + 1;
      }
    );

  readonly lastItemNumber =
    computed(
      () =>
        Math.min(
          this.pageNumber()
          *
          this.pageSize(),

          this.totalItems()
        )
    );


  // =========================================================
  // FILTER STATE
  // =========================================================

  readonly hasFilters =
    computed(
      () =>
        this.search()
          .trim()
          .length > 0
        ||
        this.isActiveFilter()
        !== null
    );


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.load();
  }


  // =========================================================
  // LOAD
  // =========================================================

  load(): void {

    this.loading.set(
      true
    );

    this.errorMessage.set(
      ''
    );

    this.api
      .getPage({
        search:
          this.search(),

        isActive:
          this.isActiveFilter(),

        sortBy:
          'name',

        sortDirection:
          'asc',

        pageNumber:
          this.pageNumber(),

        pageSize:
          this.pageSize()
      })
      .subscribe({

        next:
          result => {

            const items =
              Array.isArray(
                result.items
              )
                ? result.items
                : [];

            this.items.set(
              items
            );

            this.totalItems.set(
              Number(
                result.totalItems
                ??
                0
              )
            );

            this.pageNumber.set(
              Number(
                result.pageNumber
                ??
                this.pageNumber()
              )
            );

            this.pageSize.set(
              Number(
                result.pageSize
                ??
                this.pageSize()
              )
            );

            this.loading.set(
              false
            );
          },

        error:
          error => {

            this.errorMessage.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'guestServices.loadFailed'
                )
              )
            );

            this.items.set(
              []
            );

            this.totalItems.set(
              0
            );

            this.loading.set(
              false
            );
          }
      });
  }


// =========================================================
// SEARCH INPUT
// =========================================================

setSearch(
  event: Event
): void {

  const target =
    event.target;

  if (
    !(target instanceof HTMLInputElement)
  ) {
    return;
  }

  this.search.set(
    target.value
  );
}


// =========================================================
// STATUS FILTER
// =========================================================

setStatus(
  event: Event
): void {

  const target =
    event.target;

  if (
    !(target instanceof HTMLSelectElement)
  ) {
    return;
  }

  const value =
    target.value;

  if (
    value === 'active'
  ) {

    this.isActiveFilter.set(
      true
    );

    return;
  }

  if (
    value === 'inactive'
  ) {

    this.isActiveFilter.set(
      false
    );

    return;
  }

  this.isActiveFilter.set(
    null
  );
}
  // =========================================================
  // APPLY FILTERS
  // =========================================================

  applyFilters(): void {

    if (
      this.loading()
    ) {
      return;
    }

    this.pageNumber.set(
      1
    );

    this.load();
  }


  // =========================================================
  // SEARCH ENTER
  // =========================================================

  onSearchKeydown(
    event: KeyboardEvent
  ): void {

    if (
      event.key !== 'Enter'
    ) {
      return;
    }

    event.preventDefault();

    this.applyFilters();
  }


  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  clearFilters(): void {

    if (
      this.loading()
    ) {
      return;
    }

    this.search.set(
      ''
    );

    this.isActiveFilter.set(
      null
    );

    this.pageNumber.set(
      1
    );

    this.load();
  }


  // =========================================================
  // PREVIOUS PAGE
  // =========================================================

  previousPage(): void {

    if (
      this.loading()
      ||
      !this.hasPreviousPage()
    ) {
      return;
    }

    this.pageNumber.update(
      value =>
        Math.max(
          1,
          value - 1
        )
    );

    this.load();
  }


  // =========================================================
  // NEXT PAGE
  // =========================================================

  nextPage(): void {

    if (
      this.loading()
      ||
      !this.hasNextPage()
    ) {
      return;
    }

    this.pageNumber.update(
      value =>
        value + 1
    );

    this.load();
  }


  // =========================================================
  // REQUEST DELETE
  // =========================================================

  requestDelete(
    item: GuestService
  ): void {

    if (
      this.deletingId()
      !== null
    ) {
      return;
    }

    if (
      !this.auth.hasPermission(
        'services.delete'
      )
    ) {
      return;
    }

    this.deleteTarget.set(
      item
    );
  }


  // =========================================================
  // CANCEL DELETE
  // =========================================================

  cancelDelete(): void {

    if (
      this.deletingId()
      !== null
    ) {
      return;
    }

    this.deleteTarget.set(
      null
    );
  }


  // =========================================================
  // CONFIRM DELETE
  // =========================================================

  confirmDelete(): void {

    const item =
      this.deleteTarget();

    if (
      item === null
      ||
      this.deletingId()
      !== null
    ) {
      return;
    }

    this.deletingId.set(
      item.id
    );

    this.api
      .delete(
        item.id
      )
      .subscribe({

        next:
          () => {

            this.deletingId.set(
              null
            );

            this.deleteTarget.set(
              null
            );

            this.toast.success(
              this.translation.translate(
                'guestServices.deleteSuccess'
              )
            );

            // If this was the last row on a page,
            // move back one page before reloading.

            if (
              this.items().length === 1
              &&
              this.pageNumber() > 1
            ) {

              this.pageNumber.update(
                value =>
                  Math.max(
                    1,
                    value - 1
                  )
              );
            }

            this.load();
          },

        error:
          error => {

            this.deletingId.set(
              null
            );

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'guestServices.deleteFailed'
                )
              )
            );
          }
      });
  }
}
