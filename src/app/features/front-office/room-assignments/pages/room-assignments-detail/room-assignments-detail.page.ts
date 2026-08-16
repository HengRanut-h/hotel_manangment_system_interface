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
  LucideCheckCircle2,
  LucideClipboardList,
  LucidePencil,
  LucideRefreshCw
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
  RoomAssignmentStatusBadgeComponent
} from '../../components/room-assignment-status-badge/room-assignment-status-badge.component';

import {
  RoomAssignmentsApiService
} from '../../data-access/room-assignments-api.service';

import {
  ReservationLookup,
  RoomAssignment
} from '../../models/room-assignment.model';

@Component({
  selector:
    'app-room-assignments-detail-page',

  standalone:
    true,

  imports: [
    DatePipe,
    DecimalPipe,
    RouterLink,
    TranslationPipe,
    SpinComponent,
    RoomAssignmentStatusBadgeComponent,
    LucideArrowLeft,
    LucideCheckCircle2,
    LucideClipboardList,
    LucidePencil,
    LucideRefreshCw
  ],

  templateUrl:
    './room-assignments-detail.page.html',

  styleUrl:
    './room-assignments-detail.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class RoomAssignmentsDetailPage
  implements OnInit {

  readonly auth =
    inject(AuthStore);

  private readonly api =
    inject(RoomAssignmentsApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly toast =
    inject(ToastService);

  private readonly translation =
    inject(TranslationService);

  readonly item =
    signal<RoomAssignment | null>(null);

  readonly loading =
    signal(true);

  readonly errorMessage =
    signal('');

  readonly statusDraft =
    signal('');

  readonly reservations =
    signal<ReservationLookup[]>([]);

  readonly updatingStatus =
    signal(false);

  ngOnInit(): void {
    this.loadReservations();
    this.load();
  }

  reservationById(
    id: string | null
  ): ReservationLookup | null {
    if (!id) {
      return null;
    }

    return (
      this.reservations()
        .find(
          candidate =>
            candidate.id === id
        )
      ??
      null
    );
  }

  reservationLabel(
    id: string | null
  ): string {
    const reservation =
      this.reservationById(id);

    if (!reservation) {
      return '—';
    }

    return [
      reservation.reservationNumber,
      reservation.guestName
    ]
      .filter(Boolean)
      .join(' — ')
      ||
      reservation.id;
  }

  load(): void {
    const id =
      this.route.snapshot.paramMap
        .get('id');

    if (!id) {
      this.loading.set(false);

      this.errorMessage.set(
        this.translation.translate(
          'roomAssignments.missingId'
        )
      );

      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.api
      .getById(id)
      .subscribe({

        next:
          item => {
            this.item.set(item);
            this.statusDraft.set(
              item.status
            );
            this.loading.set(false);
          },

        error:
          error => {
            this.errorMessage.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'roomAssignments.loadOneFailed'
                )
              )
            );

            this.loading.set(false);
          }
      });
  }

  setStatusDraft(
    event: Event
  ): void {
    const target =
      event.target;

    if (
      !(target instanceof HTMLInputElement)
    ) {
      return;
    }

    this.statusDraft.set(
      target.value
    );
  }

  saveStatus(): void {
    const item =
      this.item();

    const status =
      this.statusDraft()
        .trim();

    if (
      !item
      ||
      !status
      ||
      this.updatingStatus()
      ||
      !this.auth.hasPermission(
        'room-assignments.update'
      )
    ) {
      return;
    }

    this.updatingStatus.set(true);

    this.api
      .changeStatus(
        item.id,
        {
          status
        }
      )
      .subscribe({

        next:
          () => {
            this.updatingStatus.set(false);

            this.toast.success(
              this.translation.translate(
                'roomAssignments.statusUpdated'
              )
            );

            this.load();
          },

        error:
          error => {
            this.updatingStatus.set(false);

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'roomAssignments.statusUpdateFailed'
                )
              )
            );
          }
      });
  }

  private loadReservations(): void {
    this.api
      .getReservations()
      .subscribe({

        next:
          items => {
            this.reservations.set(
              Array.isArray(items)
                ? items
                : []
            );
          },

        error:
          () => {
            this.reservations.set([]);
          }
      });
  }
}
