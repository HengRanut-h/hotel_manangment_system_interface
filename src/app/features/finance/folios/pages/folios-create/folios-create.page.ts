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
  Router,
  RouterLink
} from '@angular/router';

import {
  LucideArrowLeft,
  LucideCheckCircle2,
  LucideClipboardList,
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
  FoliosApiService
} from '../../data-access/folios-api.service';

import {
  ReservationLookup
} from '../../models/folio.model';

@Component({
  selector:
    'app-folios-create-page',

  standalone:
    true,

  imports: [
    DatePipe,
    RouterLink,
    TranslationPipe,
    SpinComponent,
    LucideArrowLeft,
    LucideCheckCircle2,
    LucideClipboardList,
    LucideRefreshCw
  ],

  templateUrl:
    './folios-create.page.html',

  styleUrl:
    './folios-create.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class FoliosCreatePage
  implements OnInit {

  private readonly api =
    inject(FoliosApiService);

  private readonly router =
    inject(Router);

  private readonly translation =
    inject(TranslationService);

  private readonly toast =
    inject(ToastService);

  readonly reservations =
    signal<ReservationLookup[]>([]);

  readonly selectedReservationId =
    signal('');

  readonly loading =
    signal(true);

  readonly saving =
    signal(false);

  readonly errorMessage =
    signal('');

  readonly selectedReservation =
    computed(
      () =>
        this.reservations()
          .find(
            reservation =>
              reservation.id
              ===
              this.selectedReservationId()
          )
        ??
        null
    );


  ngOnInit(): void {

    this.loadReservations();
  }


  loadReservations(): void {

    this.loading.set(true);
    this.errorMessage.set('');

    this.api
      .getReservations()
      .subscribe({

        next:
          reservations => {

            this.reservations.set(
              reservations
            );

            this.loading.set(false);
          },

        error:
          error => {

            this.errorMessage.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'folios.reservationsLoadFailed'
                )
              )
            );

            this.loading.set(false);
          }
      });
  }


  setReservation(
    event: Event
  ): void {

    const target =
      event.target;

    if (
      target instanceof HTMLSelectElement
    ) {
      this.selectedReservationId.set(
        target.value
      );
    }
  }


  submit(): void {

    const reservation =
      this.selectedReservation();

    if (
      !reservation
      ||
      this.saving()
    ) {
      return;
    }

    this.saving.set(true);

    this.api
      .create({
        reservationId:
          reservation.id,

        guestId:
          reservation.guestId
          ||
          null
      })
      .subscribe({

        next:
          folio => {

            this.saving.set(false);

            this.toast.success(
              this.translation.translate(
                'folios.createSuccess'
              )
            );

            void this.router.navigate([
              '/app/front-office/folios',
              folio.id
            ]);
          },

        error:
          error => {

            this.saving.set(false);

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'folios.createFailed'
                )
              )
            );
          }
      });
  }
}
