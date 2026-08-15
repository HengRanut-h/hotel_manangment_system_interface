import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input
} from '@angular/core';

@Component({
  selector:
    'app-transportation-status-badge',

  standalone:
    true,

  templateUrl:
    './transportation-status-badge.component.html',

  styleUrl:
    './transportation-status-badge.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class TransportationStatusBadgeComponent {

  readonly status =
    input('');

  readonly normalized =
    computed(
      () =>
        this.status()
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '-')
    );

  readonly cssClass =
    computed(
      () => {

        const value =
          this.normalized();

        if (
          value === 'completed'
          ||
          value === 'arrived'
          ||
          value === 'closed'
        ) {
          return 'status status--success';
        }

        if (
          value === 'scheduled'
          ||
          value === 'pending'
          ||
          value === 'requested'
        ) {
          return 'status status--warning';
        }

        if (
          value === 'in-progress'
          ||
          value === 'scheduled'
          ||
          value === 'enroute'
          ||
          value === 'en-route'
        ) {
          return 'status status--info';
        }

        if (
          value === 'cancelled'
          ||
          value === 'canceled'
          ||
          value === 'rejected'
        ) {
          return 'status status--danger';
        }

        return 'status status--neutral';
      }
    );
}
