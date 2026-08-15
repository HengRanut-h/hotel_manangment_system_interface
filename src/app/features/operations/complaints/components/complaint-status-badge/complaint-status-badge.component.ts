import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input
} from '@angular/core';

@Component({
  selector:
    'app-complaint-status-badge',

  standalone:
    true,

  templateUrl:
    './complaint-status-badge.component.html',

  styleUrl:
    './complaint-status-badge.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class ComplaintStatusBadgeComponent {

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
          value === 'resolved'
          ||
          value === 'closed'
          ||
          value === 'completed'
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
