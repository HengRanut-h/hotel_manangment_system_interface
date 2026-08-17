import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  finalize
} from 'rxjs';

import {
  LucideBed,
  LucideCalendar,
  LucideMoon,
  LucideRefreshCw,
  LucideSearch,
  LucideX
} from '@lucide/angular';

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
  AvailabilityRoomCardComponent
} from '../../components/availability-room-card/availability-room-card.component';

import {
  AvailabilitySearchComponent
} from '../../components/availability-search/availability-search.component';

import {
  AvailabilityStatsComponent
} from '../../components/availability-stats/availability-stats.component';

import {
  AvailabilityApiService
} from '../../data-access/availability-api.service';

import {
  AvailabilityQuery,
  AvailabilityRoom,
  AvailabilityRoomTypeOption,
  AvailabilitySearchSummary
} from '../../models/availability.model';

@Component({
  selector:
    'app-availability-page',

  standalone:
    true,

imports: [
  TranslationPipe,
  SpinComponent,

  AvailabilityRoomCardComponent,
  AvailabilitySearchComponent,
  AvailabilityStatsComponent,

  LucideBed,
  LucideCalendar,
  LucideMoon,
  LucideRefreshCw,
  LucideSearch,
  LucideX
],

  templateUrl:
    './availability-page.page.html',

  styleUrl:
    './availability-page.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class AvailabilityPage
  implements OnInit {

  // =========================================================
  // DEPENDENCIES
  // =========================================================

  private readonly api =
    inject(
      AvailabilityApiService
    );


  private readonly translation =
    inject(
      TranslationService
    );


  // =========================================================
  // ROOMS
  // =========================================================

  readonly rooms =
    signal<
      AvailabilityRoom[]
    >(
      []
    );


  // =========================================================
  // ROOM TYPE OPTIONS
  // =========================================================

  readonly roomTypeOptions =
    signal<
      AvailabilityRoomTypeOption[]
    >(
      []
    );


  readonly roomTypesLoading =
    signal(false);


  // =========================================================
  // PAGE STATE
  // =========================================================

  readonly loading =
    signal(false);


  readonly searched =
    signal(false);


  readonly errorMessage =
    signal('');


  readonly lastQuery =
    signal<
      AvailabilityQuery | null
    >(
      null
    );


  // =========================================================
  // FILTERS
  // =========================================================

  readonly searchText =
    signal('');


  readonly roomTypeFilter =
    signal('');


  readonly statusFilter =
    signal('');


  // =========================================================
  // RESULT ROOM TYPES
  //
  // Display name.
  // Value stays ID internally.
  // =========================================================

  readonly resultRoomTypes =
    computed(() => {

      const values =
        new Map<
          string,
          string
        >();


      for (
        const room
        of this.rooms()
      ) {

        if (
          room.roomTypeId
          &&
          room.roomTypeName
        ) {

          values.set(
            room.roomTypeId,
            room.roomTypeName
          );
        }
      }


      return Array
        .from(
          values.entries()
        )
        .map(
          (
            [
              id,
              name
            ]
          ) => ({
            id,
            name
          })
        )
        .sort(
          (
            left,
            right
          ) =>
            left.name.localeCompare(
              right.name
            )
        );
    });


  // =========================================================
  // STATUSES
  // =========================================================

  readonly statuses =
    computed(() => {

      const values =
        this.rooms()
          .map(
            room =>
              room.status
                .trim()
          )
          .filter(
            Boolean
          );


      return Array
        .from(
          new Set(
            values
          )
        )
        .sort(
          (
            left,
            right
          ) =>
            left.localeCompare(
              right
            )
        );
    });


  // =========================================================
  // FILTERED ROOMS
  // =========================================================

  readonly filteredRooms =
    computed(() => {

      const search =
        this.searchText()
          .trim()
          .toLowerCase();


      const roomTypeId =
        this.roomTypeFilter()
          .trim();


      const status =
        this.statusFilter()
          .trim()
          .toLowerCase();


      return this.rooms()
        .filter(
          room => {


            // =================================================
            // ROOM TYPE
            // =================================================

            if (
              roomTypeId
              &&
              room.roomTypeId
                !== roomTypeId
            ) {

              return false;
            }


            // =================================================
            // STATUS
            // =================================================

            if (
              status
              &&
              room.status
                .trim()
                .toLowerCase()
                !== status
            ) {

              return false;
            }


            // =================================================
            // SEARCH
            // =================================================

            if (
              search
            ) {

              const haystack =
                [
                  room.roomNumber,
                  room.roomTypeName,
                  room.status
                ]
                  .join(' ')
                  .toLowerCase();


              if (
                !haystack.includes(
                  search
                )
              ) {

                return false;
              }
            }


            return true;
          }
        );
    });


  // =========================================================
  // SUMMARY
  // =========================================================

  readonly summary =
    computed<
      AvailabilitySearchSummary
    >(
      () => {

        const rooms =
          this.rooms();


        const rates =
          rooms
            .map(
              room =>
                Number(
                  room.baseRate
                )
            )
            .filter(
              rate =>
                Number.isFinite(
                  rate
                )
            );


        return {

          roomsFound:
            rooms.length,


          roomTypes:
            new Set(
              rooms.map(
                room =>
                  room.roomTypeId
              )
            ).size,


          lowestBaseRate:
            rates.length
              ? Math.min(
                  ...rates
                )
              : null,


          averageBaseRate:
            rates.length

              ? rates.reduce(
                  (
                    total,
                    rate
                  ) =>
                    total
                    +
                    rate,
                  0
                )
                /
                rates.length

              : null
        };
      }
    );


  // =========================================================
  // NIGHTS
  // =========================================================

  readonly nights =
    computed(() => {

      const query =
        this.lastQuery();


      if (
        !query
      ) {

        return 0;
      }


      const checkIn =
        this.toUtcMilliseconds(
          query.checkIn
        );


      const checkOut =
        this.toUtcMilliseconds(
          query.checkOut
        );


      if (
        checkIn === null
        ||
        checkOut === null
      ) {

        return 0;
      }


      return Math.max(
        0,

        Math.round(
          (
            checkOut
            -
            checkIn
          )
          /
          86_400_000
        )
      );
    });


  // =========================================================
  // FILTER ACTIVE
  // =========================================================

  readonly hasFilters =
    computed(
      () =>
        !!this.searchText()
          .trim()
        ||
        !!this.roomTypeFilter()
          .trim()
        ||
        !!this.statusFilter()
          .trim()
    );


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.loadRoomTypes();
  }


  // =========================================================
  // LOAD ROOM TYPES
  // =========================================================

  loadRoomTypes(): void {

    if (
      this.roomTypesLoading()
    ) {

      return;
    }


    this.roomTypesLoading.set(
      true
    );


    this.api
      .getRoomTypeOptions()
      .pipe(
        finalize(
          () =>
            this.roomTypesLoading.set(
              false
            )
        )
      )
      .subscribe({

        next:
          roomTypes => {

            this.roomTypeOptions.set(
              roomTypes
            );
          },


        error:
          () => {

            // Availability search can still work
            // without filtering by room type.

            this.roomTypeOptions.set(
              []
            );
          }
      });
  }


  // =========================================================
  // SEARCH AVAILABILITY
  // =========================================================

  search(
    query: AvailabilityQuery
  ): void {

    if (
      this.loading()
    ) {

      return;
    }


    this.loading.set(
      true
    );


    this.searched.set(
      true
    );


    this.errorMessage.set(
      ''
    );


    this.lastQuery.set(
      query
    );


    this.api
      .search(
        query
      )
      .pipe(
        finalize(
          () =>
            this.loading.set(
              false
            )
        )
      )
      .subscribe({

        next:
          rooms => {

            this.rooms.set(
              rooms
            );


            this.clearFilters();
          },


        error:
          error => {

            this.rooms.set(
              []
            );


            this.errorMessage.set(
              getSafeApiErrorMessage(
                error,

                this.translation.translate(
                  'availability.loadFailed'
                )
              )
            );
          }
      });
  }


  // =========================================================
  // RETRY
  // =========================================================

  retry(): void {

    const query =
      this.lastQuery();


    if (
      query
    ) {

      this.search(
        query
      );
    }
  }


  // =========================================================
  // SEARCH TEXT
  // =========================================================

  setSearchText(
    event: Event
  ): void {

    const target =
      event.target;


    if (
      !(
        target instanceof
        HTMLInputElement
      )
    ) {

      return;
    }


    this.searchText.set(
      target.value
    );
  }


  // =========================================================
  // CLEAR SEARCH TEXT
  // =========================================================

  clearSearchText(): void {

    this.searchText.set(
      ''
    );
  }


  // =========================================================
  // ROOM TYPE FILTER
  // =========================================================

  setRoomTypeFilter(
    event: Event
  ): void {

    const target =
      event.target;


    if (
      !(
        target instanceof
        HTMLSelectElement
      )
    ) {

      return;
    }


    this.roomTypeFilter.set(
      target.value
    );
  }


  // =========================================================
  // STATUS FILTER
  // =========================================================

  setStatusFilter(
    event: Event
  ): void {

    const target =
      event.target;


    if (
      !(
        target instanceof
        HTMLSelectElement
      )
    ) {

      return;
    }


    this.statusFilter.set(
      target.value
    );
  }


  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  clearFilters(): void {

    this.searchText.set(
      ''
    );


    this.roomTypeFilter.set(
      ''
    );


    this.statusFilter.set(
      ''
    );
  }


  // =========================================================
  // DATE
  // =========================================================

  private toUtcMilliseconds(
    value: string
  ): number | null {

    const parts =
      value
        .split('-')
        .map(
          Number
        );


    if (
      parts.length !== 3
    ) {

      return null;
    }


    const [
      year,
      month,
      day
    ] =
      parts;


    if (
      !Number.isFinite(
        year
      )
      ||
      !Number.isFinite(
        month
      )
      ||
      !Number.isFinite(
        day
      )
    ) {

      return null;
    }


    return Date.UTC(
      year,
      month - 1,
      day
    );
  }
}
