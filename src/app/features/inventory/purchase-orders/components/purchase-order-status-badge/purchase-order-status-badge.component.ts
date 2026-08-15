import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input
} from '@angular/core';

@Component({
  selector:
    'app-purchase-order-status-badge',

  standalone:
    true,

  templateUrl:
    './purchase-order-status-badge.component.html',

  styleUrl:
    './purchase-order-status-badge.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class PurchaseOrderStatusBadgeComponent {

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
          value === 'received'
          ||
          value === 'completed'
          ||
          value === 'closed'
        ) {
          return 'status status--success';
        }

        if (
          value === 'ordered'
          ||
          value === 'issued'
          ||
          value === 'sent'
        ) {
          return 'status status--info';
        }

        if (
          value === 'pending'
          ||
          value === 'draft'
          ||
          value === 'approved'
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

        return 'status status--neutral';
      }
    );
}
