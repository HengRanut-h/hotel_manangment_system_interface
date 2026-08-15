import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input
} from '@angular/core';

@Component({
  selector:
    'app-purchase-request-status-badge',

  standalone:
    true,

  templateUrl:
    './purchase-request-status-badge.component.html',

  styleUrl:
    './purchase-request-status-badge.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class PurchaseRequestStatusBadgeComponent {

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
          this.status()
            .trim()
            .toLowerCase();

        if (
          value === 'approved'
          ||
          value === 'completed'
        ) {
          return 'status status--success';
        }

        if (
          value === 'pending'
          ||
          value === 'requested'
          ||
          value === 'submitted'
          ||
          value === 'draft'
        ) {
          return 'status status--warning';
        }

        if (
          value === 'rejected'
          ||
          value === 'cancelled'
          ||
          value === 'canceled'
        ) {
          return 'status status--danger';
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

        return 'status status--neutral';
      }
    );
}
