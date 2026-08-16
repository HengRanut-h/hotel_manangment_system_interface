import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  LucideArrowLeft,
  LucideCalendar,
  LucideRefreshCw
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
  ToastService
} from '../../../../../shared/ui/toast/toast.service';

import {
  ReservationFormComponent
} from '../../components/reservation-form/reservation-form.component';

import {
  ReservationLookupsService
} from '../../data-access/reservation-lookups.service';

import {
  ReservationsApiService
} from '../../data-access/reservations-api.service';

import {
  CreateReservationRequest,
  GuestLookup,
  RoomLookup,
  RoomTypeLookup
} from '../../models/reservation.model';

@Component({
  selector:
    'app-reservation-create-page',

  standalone:
    true,

  imports: [
    RouterLink,
    TranslationPipe,
    SpinComponent,
    ReservationFormComponent,
    LucideArrowLeft,
    LucideCalendar,
    LucideRefreshCw
  ],

  templateUrl:
    './reservation-create.page.html',

  styleUrl:
    './reservation-create.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class ReservationCreatePage
  implements OnInit {

  private readonly api =
    inject(ReservationsApiService);

  private readonly lookupsApi =
    inject(ReservationLookupsService);

  private readonly router =
    inject(Router);

  private readonly toast =
    inject(ToastService);

  private readonly translation =
    inject(TranslationService);

  readonly guests =
    signal<GuestLookup[]>([]);

  readonly roomTypes =
    signal<RoomTypeLookup[]>([]);

  readonly rooms =
    signal<RoomLookup[]>([]);

  readonly loadingLookups =
    signal(true);

  readonly lookupError =
    signal('');

  readonly submitting =
    signal(false);

  ngOnInit(): void {
    this.loadLookups();
  }

  loadLookups(): void {

    this.loadingLookups.set(true);
    this.lookupError.set('');

    this.lookupsApi
      .load()
      .subscribe({

        next:
          lookups => {

            this.guests.set(
              lookups.guests
            );

            this.roomTypes.set(
              lookups.roomTypes
            );

            this.rooms.set(
              lookups.rooms
            );

            this.loadingLookups.set(false);
          },

        error:
          error => {

            this.guests.set([]);
            this.roomTypes.set([]);
            this.rooms.set([]);

            this.lookupError.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'reservations.lookupLoadFailed'
                )
              )
            );

            this.loadingLookups.set(false);
          }
      });
  }

  create(
    request: CreateReservationRequest
  ): void {

    if (
      this.submitting()
    ) {
      return;
    }

    this.submitting.set(true);

    this.api
      .create(request)
      .subscribe({

        next:
          reservation => {

            this.submitting.set(false);

            this.toast.success(
              this.translation.translate(
                'reservations.createSuccess'
              )
            );

            void this.router.navigate([
              '/app/front-office/reservations',
              reservation.id
            ]);
          },

        error:
          error => {

            this.submitting.set(false);

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'reservations.createFailed'
                )
              )
            );
          }
      });
  }
}
