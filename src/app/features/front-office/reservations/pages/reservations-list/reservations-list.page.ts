import {
  DatePipe,
  DecimalPipe
} from '@angular/common';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  RouterLink
} from '@angular/router';

import {
  LucideCalendar,
  LucideDollarSign,
  LucideEye,
  LucidePlus,
  LucideRefreshCw,
  LucideSearch,
  LucideUserCheck,
  LucideX,
    LucideMoon,
   LucideBed,
  LucideHash,
  LucideUser,
  LucideUsers
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
  ReservationStatusBadgeComponent
} from '../../components/reservation-status-badge/reservation-status-badge.component';

import {
  ReservationsApiService
} from '../../data-access/reservations-api.service';

import {
  Reservation
} from '../../models/reservation.model';

@Component({
  selector:
    'app-reservations-list-page',

  standalone:
    true,

  imports: [
    DatePipe,
    DecimalPipe,
    RouterLink,
    TranslationPipe,
    SpinComponent,
    ReservationStatusBadgeComponent,
    LucideCalendar,
    LucideDollarSign,
    LucideEye,
    LucidePlus,
    LucideRefreshCw,
    LucideSearch,
    LucideUserCheck,
    LucideX,
    LucideMoon,
     LucideBed,
  LucideHash,
  LucideUser,
  LucideUsers
  ],

  templateUrl:
    './reservations-list.page.html',

  styleUrl:
    './reservations-list.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class ReservationsListPage
  implements OnInit {

  readonly auth =
    inject(AuthStore);

  private readonly api =
    inject(ReservationsApiService);

  private readonly translation =
    inject(TranslationService);

  readonly reservations =
    signal<Reservation[]>([]);

  readonly loading =
    signal(true);

  readonly errorMessage =
    signal('');

  readonly search =
    signal('');

  readonly statusFilter =
    signal('');

  readonly backendTotalItems =
    signal<number | null>(null);

  readonly statuses =
    computed(
      () =>
        Array
          .from(
            new Set(
              this.reservations()
                .map(
                  item =>
                    item.status.trim()
                )
                .filter(Boolean)
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
          )
    );

  readonly filtered =
    computed(
      () => {

        const search =
          this.search()
            .trim()
            .toLowerCase();

        const status =
          this.statusFilter()
            .trim()
            .toLowerCase();

        return this.reservations()
          .filter(
            item => {

              if (
                status
                &&
                item.status
                  .trim()
                  .toLowerCase()
                !== status
              ) {
                return false;
              }

              if (!search) {
                return true;
              }

              const haystack =
                [
                  item.reservationNumber,
                  item.guestName,
                  item.roomTypeName,
                  item.roomNumber ?? '',
                  item.status
                ]
                  .join(' ')
                  .toLowerCase();

              return haystack.includes(
                search
              );
            }
          );
      }
    );

  readonly loadedCount =
    computed(
      () =>
        this.reservations().length
    );

  readonly confirmedCount =
    computed(
      () =>
        this.reservations()
          .filter(
            item =>
              this.normalizeStatus(
                item.status
              )
              === 'confirmed'
          )
          .length
    );

  readonly checkedInCount =
    computed(
      () =>
        this.reservations()
          .filter(
            item =>
              this.normalizeStatus(
                item.status
              )
              === 'checkedin'
          )
          .length
    );

  readonly loadedValue =
    computed(
      () =>
        this.reservations()
          .reduce(
            (
              total,
              item
            ) =>
              total
              +
              (
                Number.isFinite(
                  item.totalAmount
                )
                  ? item.totalAmount
                  : 0
              ),
            0
          )
    );

  readonly hasFilters =
    computed(
      () =>
        !!this.search().trim()
        ||
        !!this.statusFilter()
    );

  ngOnInit(): void {
    this.load();
  }

  load(): void {

    if (
      this.loading()
      &&
      this.reservations().length > 0
    ) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.api
      .getAll()
      .subscribe({

        next:
          result => {

            this.reservations.set(
              result.items
            );

            this.backendTotalItems.set(
              result.totalItems
              ??
              null
            );

            this.loading.set(false);
          },

        error:
          error => {

            this.reservations.set([]);
            this.backendTotalItems.set(null);

            this.errorMessage.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'reservations.loadFailed'
                )
              )
            );

            this.loading.set(false);
          }
      });
  }

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

    this.statusFilter.set(
      target.value
    );
  }

  clearFilters(): void {
    this.search.set('');
    this.statusFilter.set('');
  }

  private normalizeStatus(
    status: string
  ): string {

    return status
      .trim()
      .toLowerCase()
      .replace(
        /[\s_-]+/g,
        ''
      );
  }
}
