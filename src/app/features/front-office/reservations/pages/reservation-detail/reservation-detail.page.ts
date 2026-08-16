import {
  DatePipe,
  DecimalPipe
} from '@angular/common';

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import {
  LucideArrowLeft,
  LucideBan,
  LucideBed,
  LucideCalendar,
  LucideLogIn,
  LucideLogOut,
  LucideRefreshCw,
  LucideUser
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
  ReservationStatusBadgeComponent
} from '../../components/reservation-status-badge/reservation-status-badge.component';

import {
  ReservationsApiService
} from '../../data-access/reservations-api.service';

import {
  Reservation
} from '../../models/reservation.model';

type ReservationWorkflow =
  'cancel'
  |
  'checkIn'
  |
  'checkOut';

@Component({
  selector:
    'app-reservation-detail-page',

  standalone:
    true,

  imports: [
    DatePipe,
    DecimalPipe,
    RouterLink,
    TranslationPipe,
    SpinComponent,
    ReservationStatusBadgeComponent,
    LucideArrowLeft,
    LucideBan,
    LucideBed,
    LucideCalendar,
    LucideLogIn,
    LucideLogOut,
    LucideRefreshCw,
    LucideUser
  ],

  templateUrl:
    './reservation-detail.page.html',

  styleUrl:
    './reservation-detail.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class ReservationDetailPage
  implements OnInit {

  readonly auth =
    inject(AuthStore);

  private readonly api =
    inject(ReservationsApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly toast =
    inject(ToastService);

  private readonly translation =
    inject(TranslationService);

  readonly reservation =
    signal<Reservation | null>(null);

  readonly loading =
    signal(true);

  readonly errorMessage =
    signal('');

  readonly runningWorkflow =
    signal<ReservationWorkflow | null>(
      null
    );

  private id =
    '';

  ngOnInit(): void {

    this.id =
      this.route.snapshot
        .paramMap
        .get('id')
      ??
      '';

    if (!this.id) {
      this.loading.set(false);

      this.errorMessage.set(
        this.translation.translate(
          'reservations.invalidReservationId'
        )
      );

      return;
    }

    this.load();
  }

  load(): void {

    if (!this.id) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.api
      .getById(
        this.id
      )
      .subscribe({

        next:
          item => {

            this.reservation.set(
              item
            );

            this.loading.set(false);
          },

        error:
          error => {

            this.reservation.set(null);

            this.errorMessage.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'reservations.detailLoadFailed'
                )
              )
            );

            this.loading.set(false);
          }
      });
  }

  cancel(): void {

    if (
      !window.confirm(
        this.translation.translate(
          'reservations.confirmCancel'
        )
      )
    ) {
      return;
    }

    this.runWorkflow(
      'cancel'
    );
  }

  checkIn(): void {

    if (
      !window.confirm(
        this.translation.translate(
          'reservations.confirmCheckIn'
        )
      )
    ) {
      return;
    }

    this.runWorkflow(
      'checkIn'
    );
  }

  checkOut(): void {

    if (
      !window.confirm(
        this.translation.translate(
          'reservations.confirmCheckOut'
        )
      )
    ) {
      return;
    }

    this.runWorkflow(
      'checkOut'
    );
  }

  private runWorkflow(
    workflow: ReservationWorkflow
  ): void {

    if (
      this.runningWorkflow()
      ||
      !this.id
    ) {
      return;
    }

    this.runningWorkflow.set(
      workflow
    );

    const request =
      workflow === 'cancel'
        ? this.api.cancel(
            this.id
          )
        : workflow === 'checkIn'
          ? this.api.checkIn(
              this.id
            )
          : this.api.checkOut(
              this.id
            );

    request.subscribe({

      next:
        updated => {

          this.runningWorkflow.set(
            null
          );

          this.toast.success(
            this.translation.translate(
              workflow === 'cancel'
                ? 'reservations.cancelSuccess'
                : workflow === 'checkIn'
                  ? 'reservations.checkInSuccess'
                  : 'reservations.checkOutSuccess'
            )
          );

          if (updated) {
            this.reservation.set(
              updated
            );
          } else {
            this.load();
          }
        },

      error:
        error => {

          this.runningWorkflow.set(
            null
          );

          this.toast.error(
            getSafeApiErrorMessage(
              error,
              this.translation.translate(
                workflow === 'cancel'
                  ? 'reservations.cancelFailed'
                  : workflow === 'checkIn'
                    ? 'reservations.checkInFailed'
                    : 'reservations.checkOutFailed'
              )
            )
          );
        }
    });
  }
}
