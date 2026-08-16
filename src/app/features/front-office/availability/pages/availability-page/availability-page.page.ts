import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal
} from '@angular/core';

import {
  LucideBed,
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
  AvailabilitySearchSummary
} from '../../models/availability.model';

@Component({
  selector: 'app-availability-page',
  standalone: true,
  imports: [
    TranslationPipe,
    SpinComponent,
    AvailabilityRoomCardComponent,
    AvailabilitySearchComponent,
    AvailabilityStatsComponent,
    LucideBed,
    LucideRefreshCw,
    LucideSearch,
    LucideX
  ],
  templateUrl: './availability-page.page.html',
  styleUrl: './availability-page.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvailabilityPage {
  private readonly api =
    inject(AvailabilityApiService);

  private readonly translation =
    inject(TranslationService);

  readonly rooms =
    signal<AvailabilityRoom[]>([]);

  readonly loading =
    signal(false);

  readonly searched =
    signal(false);

  readonly errorMessage =
    signal('');

  readonly lastQuery =
    signal<AvailabilityQuery | null>(null);

  readonly searchText =
    signal('');

  readonly roomTypeFilter =
    signal('');

  readonly statusFilter =
    signal('');

  readonly roomTypes =
    computed(() => {
      const map =
        new Map<string, string>();

      for (const room of this.rooms()) {
        if (
          room.roomTypeId &&
          room.roomTypeName
        ) {
          map.set(
            room.roomTypeId,
            room.roomTypeName
          );
        }
      }

      return Array
        .from(map.entries())
        .map(
          ([id, name]) => ({
            id,
            name
          })
        )
        .sort(
          (left, right) =>
            left.name.localeCompare(
              right.name
            )
        );
    });

  readonly statuses =
    computed(() =>
      Array
        .from(
          new Set(
            this.rooms()
              .map(
                room =>
                  room.status.trim()
              )
              .filter(Boolean)
          )
        )
        .sort(
          (left, right) =>
            left.localeCompare(right)
        )
    );

  readonly filteredRooms =
    computed(() => {
      const search =
        this.searchText()
          .trim()
          .toLowerCase();

      const roomTypeId =
        this.roomTypeFilter();

      const status =
        this.statusFilter()
          .trim()
          .toLowerCase();

      return this.rooms()
        .filter(room => {
          if (
            roomTypeId &&
            room.roomTypeId !== roomTypeId
          ) {
            return false;
          }

          if (
            status &&
            room.status
              .trim()
              .toLowerCase() !== status
          ) {
            return false;
          }

          if (search) {
            const haystack =
              [
                room.roomNumber,
                room.roomTypeName,
                room.status
              ]
                .join(' ')
                .toLowerCase();

            if (!haystack.includes(search)) {
              return false;
            }
          }

          return true;
        });
    });

  readonly summary =
    computed<AvailabilitySearchSummary>(
      () => {
        const rooms =
          this.rooms();

        const rates =
          rooms
            .map(
              room =>
                Number(room.baseRate)
            )
            .filter(
              rate =>
                Number.isFinite(rate)
            );

        const lowestBaseRate =
          rates.length
            ? Math.min(...rates)
            : null;

        const averageBaseRate =
          rates.length
            ? (
                rates.reduce(
                  (total, rate) =>
                    total + rate,
                  0
                )
                /
                rates.length
              )
            : null;

        return {
          roomsFound: rooms.length,
          roomTypes:
            new Set(
              rooms.map(
                room => room.roomTypeId
              )
            ).size,
          lowestBaseRate,
          averageBaseRate
        };
      }
    );

  readonly nights =
    computed(() => {
      const query =
        this.lastQuery();

      if (!query) {
        return 0;
      }

      const checkIn =
        this.toLocalDate(
          query.checkInDate
        );

      const checkOut =
        this.toLocalDate(
          query.checkOutDate
        );

      if (!checkIn || !checkOut) {
        return 0;
      }

      const milliseconds =
        checkOut.getTime()
        -
        checkIn.getTime();

      return Math.max(
        0,
        Math.round(
          milliseconds
          /
          86_400_000
        )
      );
    });

  readonly hasFilters =
    computed(() =>
      !!this.searchText().trim()
      ||
      !!this.roomTypeFilter()
      ||
      !!this.statusFilter()
    );

  search(
    query: AvailabilityQuery
  ): void {
    if (this.loading()) {
      return;
    }

    this.loading.set(true);
    this.searched.set(true);
    this.errorMessage.set('');
    this.lastQuery.set(query);

    this.api
      .search(query)
      .subscribe({
        next:
          rooms => {
            this.rooms.set(
              Array.isArray(rooms)
                ? rooms
                : []
            );

            this.clearFilters();
            this.loading.set(false);
          },

        error:
          error => {
            this.rooms.set([]);

            this.errorMessage.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'availability.loadFailed'
                )
              )
            );

            this.loading.set(false);
          }
      });
  }

  retry(): void {
    const query =
      this.lastQuery();

    if (query) {
      this.search(query);
    }
  }

  setSearchText(
    event: Event
  ): void {
    const target =
      event.target;

    if (
      !(target instanceof HTMLInputElement)
    ) {
      return;
    }

    this.searchText.set(
      target.value
    );
  }

  setRoomTypeFilter(
    event: Event
  ): void {
    const target =
      event.target;

    if (
      !(target instanceof HTMLSelectElement)
    ) {
      return;
    }

    this.roomTypeFilter.set(
      target.value
    );
  }

  setStatusFilter(
    event: Event
  ): void {
    const target =
      event.target;

    if (
      !(target instanceof HTMLSelectElement)
    ) {
      return;
    }

    this.statusFilter.set(
      target.value
    );
  }

  clearFilters(): void {
    this.searchText.set('');
    this.roomTypeFilter.set('');
    this.statusFilter.set('');
  }

  private toLocalDate(
    value: string
  ): Date | null {
    const parts =
      value
        .split('-')
        .map(Number);

    if (
      parts.length !== 3 ||
      parts.some(
        part =>
          !Number.isFinite(part)
      )
    ) {
      return null;
    }

    const [year, month, day] =
      parts;

    return new Date(
      year,
      month - 1,
      day
    );
  }
}
