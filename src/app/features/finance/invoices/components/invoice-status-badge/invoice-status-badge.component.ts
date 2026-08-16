
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input
} from '@angular/core';

@Component({
  selector: 'app-invoice-status-badge',
  standalone: true,
  templateUrl: './invoice-status-badge.component.html',
  styleUrl: './invoice-status-badge.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceStatusBadgeComponent {
  readonly status = input('');

  readonly normalized = computed(
    () =>
      this.status()
        .trim()
        .toLowerCase()
        .replace(/[\s_-]+/g, '')
  );

  readonly tone = computed<
    'green' | 'blue' | 'amber' | 'gray'
  >(() => {
    switch (this.normalized()) {
      case 'paid':
        return 'green';
      case 'partiallypaid':
        return 'blue';
      case 'issued':
        return 'amber';
      default:
        return 'gray';
    }
  });
}
