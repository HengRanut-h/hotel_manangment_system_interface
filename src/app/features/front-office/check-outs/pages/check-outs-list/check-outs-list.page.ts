import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  LucideCalendarCheck,
  LucideCircleCheckBig,
  LucideClock3,
  LucideRefreshCw,
  LucideSearch,
  LucideUsers,
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
  CheckOutReservationCardComponent
} from '../../components/check-out-reservation-card/check-out-reservation-card.component';

import {
  CheckOutsApiService
} from '../../data-access/check-outs-api.service';

import {
  CheckOutReservation
} from '../../models/check-out.model';

@Component({
  selector:
    'app-check-outs-list-page',

  standalone:
    true,

  imports: [
    TranslationPipe,
    SpinComponent,
    CheckOutReservationCardComponent,
    LucideCalendarCheck,
    LucideCircleCheckBig,
    LucideClock3,
    LucideRefreshCw,
    LucideSearch,
    LucideUsers,
    LucideX
  ],

  templateUrl:
    './check-outs-list.page.html',

  styleUrl:
    './check-outs-list.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class CheckOutsListPage
  implements OnInit {

  readonly auth =
    inject(AuthStore);

  private readonly api =
    inject(CheckOutsApiService);

  private readonly toast =
    inject(ToastService);

  private readonly translation =
    inject(TranslationService);

  readonly reservations =
    signal<CheckOutReservation[]>([]);

  readonly loading =
    signal(true);

  readonly errorMessage =
    signal('');

  readonly permissionMessage =
    signal('');

  readonly search =
    signal('');

  readonly statusFilter =
    signal('');

  readonly backendTotalItems =
    signal<number | null>(null);

  readonly processingId =
    signal<string | null>(null);

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
                  item.status,
                  item.checkInDate,
                  item.checkOutDate
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

  readonly checkedOutCount =
    computed(
      () =>
        this.reservations()
          .filter(
            item =>
              this.normalizeStatus(
                item.status
              )
              === 'checkedout'
          )
          .length
    );

  readonly departuresToday =
    computed(
      () => {

        const today =
          this.localDateKey(
            new Date()
          );

        return this.reservations()
          .filter(
            item =>
              item.checkOutDate
                .slice(
                  0,
                  10
                )
              === today
          )
          .length;
      }
    );

  readonly hasFilters =
    computed(
      () =>
        !!this.search().trim()
        ||
        !!this.statusFilter()
    );

  readonly canCheckOut =
    computed(
      () =>
        this.auth.hasPermission(
          'check-outs.create'
        )
    );

  ngOnInit(): void {

    if (
      !this.auth.hasPermission(
        'reservations.view'
      )
    ) {
      this.loading.set(false);

      this.permissionMessage.set(
        this.translation.translate(
          'checkOuts.reservationViewPermissionRequired'
        )
      );

      return;
    }

    this.load();
  }

  load(): void {

    if (
      !this.auth.hasPermission(
        'reservations.view'
      )
    ) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    this.permissionMessage.set('');

    this.api
      .getReservations()
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
                  'checkOuts.loadFailed'
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

  checkOut(
    reservation: CheckOutReservation
  ): void {

    if (
      !this.canCheckOut()
      ||
      this.processingId()
    ) {
      return;
    }

    const confirmation =
      this.translation.translate(
        'checkOuts.confirmCheckOut',
        {
          reservation:
            reservation.reservationNumber
            ||
            reservation.id,

          guest:
            reservation.guestName
            ||
            this.translation.translate(
              'checkOuts.unknownGuest'
            )
        }
      );

    if (
      !window.confirm(
        confirmation
      )
    ) {
      return;
    }

    this.processingId.set(
      reservation.id
    );

    this.api
      .checkOut(
        reservation.id
      )
      .subscribe({

        next:
          () => {

            this.processingId.set(
              null
            );

            this.toast.success(
              this.translation.translate(
                'checkOuts.checkOutSuccess'
              )
            );

            this.load();
          },

        error:
          error => {

            this.processingId.set(
              null
            );

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'checkOuts.checkOutFailed'
                )
              )
            );
          }
      });
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

  private localDateKey(
    date: Date
  ): string {

    const year =
      date.getFullYear();

    const month =
      String(
        date.getMonth() + 1
      )
        .padStart(
          2,
          '0'
        );

    const day =
      String(
        date.getDate()
      )
        .padStart(
          2,
          '0'
        );

    return `${year}-${month}-${day}`;
  }
}
