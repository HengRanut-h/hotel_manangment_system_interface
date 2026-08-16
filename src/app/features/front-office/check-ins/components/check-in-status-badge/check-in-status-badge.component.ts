import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input
} from '@angular/core';

@Component({
  selector:
    'app-check-in-status-badge',

  standalone:
    true,

  templateUrl:
    './check-in-status-badge.component.html',

  styleUrl:
    './check-in-status-badge.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class CheckInStatusBadgeComponent {

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
