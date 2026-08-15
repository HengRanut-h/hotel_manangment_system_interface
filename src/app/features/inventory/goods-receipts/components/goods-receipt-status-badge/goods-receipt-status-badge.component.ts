import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input
} from '@angular/core';

@Component({
  selector:
    'app-goods-receipt-status-badge',

  standalone:
    true,

  templateUrl:
    './goods-receipt-status-badge.component.html',

  styleUrl:
    './goods-receipt-status-badge.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class GoodsReceiptStatusBadgeComponent {

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
          value === 'pending'
          ||
          value === 'expected'
          ||
          value === 'in-transit'
          ||
          value === 'intransit'
        ) {
          return 'status status--warning';
        }

        if (
          value === 'partial'
          ||
          value === 'partially-received'
          ||
          value === 'partiallyreceived'
        ) {
          return 'status status--info';
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

        return 'status status--neutral';
      }
    );
}
