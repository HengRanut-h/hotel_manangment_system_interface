import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input
} from '@angular/core';

@Component({
  selector:
    'app-reservation-status-badge',

  standalone:
    true,

  templateUrl:
    './reservation-status-badge.component.html',

  styleUrl:
    './reservation-status-badge.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class ReservationStatusBadgeComponent {

  readonly status =
    input('');

  readonly cssClass =
    computed(
      () => {

        const value =
          this.status()
            .trim()
            .toLowerCase()
            .replace(
              /[\s_-]+/g,
              ''
            );

        if (
          value === 'confirmed'
        ) {
          return 'badge--confirmed';
        }

        if (
          value === 'checkedin'
        ) {
          return 'badge--checked-in';
        }

        if (
          value === 'checkedout'
        ) {
          return 'badge--checked-out';
        }

        if (
          value === 'cancelled'
          ||
          value === 'canceled'
        ) {
          return 'badge--cancelled';
        }

        if (
          value === 'pending'
        ) {
          return 'badge--pending';
        }

        return 'badge--neutral';
      }
    );
}
