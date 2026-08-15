import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input
} from '@angular/core';

@Component({
  selector:
    'app-laundry-status-badge',

  standalone:
    true,

  templateUrl:
    './laundry-status-badge.component.html',

  styleUrl:
    './laundry-status-badge.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class LaundryStatusBadgeComponent {

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
          value === 'ready'
          ||
          value === 'delivered'
          ||
          value === 'closed'
        ) {
          return 'status status--success';
        }

        if (
          value === 'open'
          ||
          value === 'pending'
        ) {
          return 'status status--warning';
        }

        if (
          value === 'in-progress'
          ||
          value === 'inprogress'
          ||
          value === 'processing'
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
