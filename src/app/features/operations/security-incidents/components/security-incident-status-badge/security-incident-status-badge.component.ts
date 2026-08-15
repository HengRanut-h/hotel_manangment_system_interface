import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input
} from '@angular/core';

@Component({
  selector:
    'app-security-incident-status-badge',

  standalone:
    true,

  templateUrl:
    './security-incident-status-badge.component.html',

  styleUrl:
    './security-incident-status-badge.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class SecurityIncidentStatusBadgeComponent {

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
          value === 'closed'
          ||
          value === 'resolved'
        ) {
          return 'status status--success';
        }

        if (
          value === 'open'
          ||
          value === 'reported'
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
          value === 'reviewing'
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
