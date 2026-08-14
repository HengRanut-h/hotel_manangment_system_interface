import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  DatePipe
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  RouterLink
} from '@angular/router';

import {
  LucideCircleCheck,
  LucideCircleX,
  LucideChevronLeft,
  LucideChevronRight,
  LucideEye,
  LucideFilter,
  LucideHotel,
  LucidePencil,
  LucidePlus,
  LucidePower,
  LucideRotateCcw,
  LucideSearch,
  LucideTrash2
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
  HotelApiService
} from '../../data-access/hotel-api.service';

import {
  Hotel,
  HotelQuery
} from '../../models/hotel.model';


type HotelStatusFilter =
  | 'all'
  | 'active'
  | 'inactive';

type HotelSortField =
  | 'name'
  | 'code'
  | 'currency'
  | 'isActive'
  | 'createdAt';

type SortDirection =
  | 'asc'
  | 'desc';


@Component({
  selector:
    'app-hotel-list-page',

  standalone:
    true,

  imports: [
    FormsModule,
    RouterLink,
    DatePipe,

    TranslationPipe,

    SpinComponent,

    LucideCircleCheck,
    LucideCircleX,
    LucideChevronLeft,
    LucideChevronRight,
    LucideEye,
    LucideFilter,
    LucideHotel,
    LucidePencil,
    LucidePlus,
    LucidePower,
    LucideRotateCcw,
    LucideSearch,
    LucideTrash2
  ],

  templateUrl:
    './hotel-list.page.html',

  styleUrl:
    './hotel-list.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class HotelListPage
  implements OnInit {

  readonly auth =
    inject(
      AuthStore
    );

  private readonly api =
    inject(
      HotelApiService
    );

  private readonly toast =
    inject(
      ToastService
    );

  private readonly translation =
    inject(
      TranslationService
    );


  // =========================================================
  // DATA
  // =========================================================

  readonly hotels =
    signal<Hotel[]>(
      []
    );


  // =========================================================
  // STATE
  // =========================================================

  readonly loading =
    signal(
      true
    );

  readonly error =
    signal(
      ''
    );

  readonly mutatingId =
    signal<string | null>(
      null
    );


  // =========================================================
  // FILTERS
  // =========================================================

  readonly search =
    signal(
      ''
    );

  readonly status =
    signal<HotelStatusFilter>(
      'all'
    );

  readonly currency =
    signal(
      ''
    );

  readonly sortBy =
    signal<HotelSortField>(
      'name'
    );

  readonly sortDirection =
    signal<SortDirection>(
      'asc'
    );


  readonly appliedStatus =
    signal<HotelStatusFilter>(
      'all'
    );

  readonly appliedCurrency =
    signal(
      ''
    );

  readonly appliedSortBy =
    signal<HotelSortField>(
      'name'
    );

  readonly appliedSortDirection =
    signal<SortDirection>(
      'asc'
    );


  // =========================================================
  // DISPLAYED HOTELS
  // =========================================================

  readonly displayedHotels =
    computed(
      () => {

        let items =
          [...this.hotels()];


        // STATUS

        if (
          this.appliedStatus()
          ===
          'active'
        ) {

          items =
            items.filter(
              hotel =>
                hotel.isActive
            );

        }


        if (
          this.appliedStatus()
          ===
          'inactive'
        ) {

          items =
            items.filter(
              hotel =>
                !hotel.isActive
            );

        }


        // CURRENCY

        const currency =
          this.appliedCurrency()
            .trim()
            .toUpperCase();


        if (currency) {

          items =
            items.filter(
              hotel =>
                hotel.currency
                  .toUpperCase()
                  .includes(
                    currency
                  )
            );

        }


        // SORT

        const direction =
          this.appliedSortDirection()
          ===
          'desc'
            ? -1
            : 1;


        items.sort(
          (a, b) => {

            let result = 0;


            switch (
              this.appliedSortBy()
            ) {

              case 'code':

                result =
                  a.code.localeCompare(
                    b.code
                  );

                break;


              case 'currency':

                result =
                  a.currency.localeCompare(
                    b.currency
                  );

                break;


              case 'isActive':

                result =
                  Number(
                    a.isActive
                  )
                  -
                  Number(
                    b.isActive
                  );

                break;


              case 'createdAt':

                result =
                  new Date(
                    a.createdAtUtc
                  ).getTime()
                  -
                  new Date(
                    b.createdAtUtc
                  ).getTime();

                break;


              case 'name':
              default:

                result =
                  a.name.localeCompare(
                    b.name
                  );

                break;

            }


            return (
              result *
              direction
            );

          }
        );


        return items;

      }
    );

  readonly activeOnPage =
    computed(
      () =>
        this.hotels()
          .filter(
            hotel =>
              hotel.isActive
          )
          .length
    );

  readonly inactiveOnPage =
    computed(
      () =>
        this.hotels()
          .filter(
            hotel =>
              !hotel.isActive
          )
          .length
    );


  // =========================================================
  // PAGINATION
  // =========================================================

  readonly pageNumber =
    signal(
      1
    );

  readonly pageSize =
    signal(
      20
    );

  readonly totalCount =
    signal(
      0
    );

  readonly totalPages =
    signal(
      1
    );

  readonly hasPreviousPage =
    signal(
      false
    );

  readonly hasNextPage =
    signal(
      false
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

    this.error.set(
      ''
    );


    const query:
      HotelQuery = {

      search:
        this.search()
          .trim(),

      pageNumber:
        this.pageNumber(),

      pageSize:
        this.pageSize()

    };


    this.api
      .getPage(
        query
      )
      .subscribe({

        next:
          result => {

            this.hotels.set(
              result.items
            );

            this.pageNumber.set(
              result.pageNumber
            );

            this.pageSize.set(
              result.pageSize
            );

            this.totalCount.set(
              result.totalItems
            );

            this.totalPages.set(
              Math.max(
                1,
                result.totalPages
              )
            );

            this.hasPreviousPage.set(
              result.hasPreviousPage
            );

            this.hasNextPage.set(
              result.hasNextPage
            );

            this.loading.set(
              false
            );

          },

        error:
          error => {

            this.hotels.set(
              []
            );

            this.totalCount.set(
              0
            );

            this.totalPages.set(
              1
            );

            this.hasPreviousPage.set(
              false
            );

            this.hasNextPage.set(
              false
            );

            this.error.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'hotels.loadFailed'
                )
              )
            );

            this.loading.set(
              false
            );

          }

      });

  }


  // =========================================================
  // APPLY FILTERS
  // =========================================================

  applyFilters(): void {

    this.appliedStatus.set(
      this.status()
    );

    this.appliedCurrency.set(
      this.currency()
        .trim()
    );

    this.appliedSortBy.set(
      this.sortBy()
    );

    this.appliedSortDirection.set(
      this.sortDirection()
    );

    this.pageNumber.set(
      1
    );

    this.load();

  }


  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  clearFilters(): void {

    this.search.set(
      ''
    );

    this.status.set(
      'all'
    );

    this.currency.set(
      ''
    );

    this.sortBy.set(
      'name'
    );

    this.sortDirection.set(
      'asc'
    );


    this.appliedStatus.set(
      'all'
    );

    this.appliedCurrency.set(
      ''
    );

    this.appliedSortBy.set(
      'name'
    );

    this.appliedSortDirection.set(
      'asc'
    );


    this.pageNumber.set(
      1
    );

    this.load();

  }


  // =========================================================
  // PREVIOUS
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
        value - 1
    );

    this.load();

  }


  // =========================================================
  // NEXT
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
  // ACTIVE
  // =========================================================

  setActive(
    hotel: Hotel,
    active: boolean
  ): void {

    if (
      this.mutatingId()
    ) {
      return;
    }


    this.mutatingId.set(
      hotel.id
    );


    this.api
      .setActive(
        hotel.id,
        active
      )
      .subscribe({

        next:
          updated => {

            this.hotels.update(
              hotels =>
                hotels.map(
                  item =>
                    item.id
                    ===
                    updated.id
                      ? updated
                      : item
                )
            );


            this.toast.success(
              this.translation.translate(
                active
                  ? 'hotels.activateSuccess'
                  : 'hotels.deactivateSuccess'
              )
            );


            this.mutatingId.set(
              null
            );

          },

        error:
          error => {

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  active
                    ? 'hotels.activateFailed'
                    : 'hotels.deactivateFailed'
                )
              )
            );

            this.mutatingId.set(
              null
            );

          }

      });

  }


  // =========================================================
  // DELETE
  // =========================================================

  deleteHotel(
    hotel: Hotel
  ): void {

    if (
      this.mutatingId()
    ) {
      return;
    }


    const message =
      this.translation.translate(
        'hotels.deleteConfirm',
        {
          name:
            hotel.name
        }
      );


    if (
      !window.confirm(
        message
      )
    ) {
      return;
    }


    this.mutatingId.set(
      hotel.id
    );


    this.api
      .delete(
        hotel.id
      )
      .subscribe({

        next:
          () => {

            this.toast.success(
              this.translation.translate(
                'hotels.deleteSuccess'
              )
            );

            this.mutatingId.set(
              null
            );


            if (
              this.hotels()
                .length === 1
              &&
              this.pageNumber() > 1
            ) {

              this.pageNumber.update(
                value =>
                  value - 1
              );

            }


            this.load();

          },

        error:
          error => {

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'hotels.deleteFailed'
                )
              )
            );

            this.mutatingId.set(
              null
            );

          }

      });

  }

}
