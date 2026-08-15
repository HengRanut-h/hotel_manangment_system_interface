import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input
} from '@angular/core';

@Component({
  selector:
    'app-lost-and-found-status-badge',

  standalone:
    true,

  templateUrl:
    './lost-and-found-status-badge.component.html',

  styleUrl:
    './lost-and-found-status-badge.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class LostAndFoundStatusBadgeComponent {

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
          value === 'returned'
          ||
          value === 'claimed'
          ||
          value === 'closed'
          ||
          value === 'resolved'
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
          value === 'assigned'
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
