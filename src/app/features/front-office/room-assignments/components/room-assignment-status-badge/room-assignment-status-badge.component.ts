import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input
} from '@angular/core';

@Component({
  selector:
    'app-room-assignment-status-badge',

  standalone:
    true,

  templateUrl:
    './room-assignment-status-badge.component.html',

  styleUrl:
    './room-assignment-status-badge.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class RoomAssignmentStatusBadgeComponent {

  readonly status =
    input('');

  readonly cssClass =
    computed(
      () => {
        const value =
          this.status()
            .trim()
            .toLowerCase()
            .replace(/[\s_-]+/g, '');

        if (
          value === 'completed'
          ||
          value === 'closed'
        ) {
          return 'status status--success';
        }

        if (
          value === 'pending'
          ||
          value === 'scheduled'
        ) {
          return 'status status--warning';
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

        if (
          value === 'inprogress'
          ||
          value === 'active'
        ) {
          return 'status status--info';
        }

        return 'status status--neutral';
      }
    );
}
