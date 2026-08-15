import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input
} from '@angular/core';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

@Component({
  selector:
    'app-inventory-stock-badge',

  standalone:
    true,

  imports: [
    TranslationPipe
  ],

  templateUrl:
    './inventory-stock-badge.component.html',

  styleUrl:
    './inventory-stock-badge.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class InventoryStockBadgeComponent {

  readonly quantity =
    input(0);

  readonly reorderLevel =
    input(0);

  readonly status =
    computed<
      'out'
      |
      'low'
      |
      'healthy'
    >(
      () => {

        const quantity =
          Number(
            this.quantity()
          );

        const reorderLevel =
          Number(
            this.reorderLevel()
          );

        if (
          quantity <= 0
        ) {
          return 'out';
        }

        if (
          quantity <= reorderLevel
        ) {
          return 'low';
        }

        return 'healthy';
      }
    );

  readonly translationKey =
    computed(
      () => {

        if (
          this.status() === 'out'
        ) {
          return 'inventoryItems.outOfStock';
        }

        if (
          this.status() === 'low'
        ) {
          return 'inventoryItems.lowStock';
        }

        return 'inventoryItems.healthyStock';
      }
    );
}
