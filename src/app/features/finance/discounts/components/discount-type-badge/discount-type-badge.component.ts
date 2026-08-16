import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input
} from '@angular/core';

import {
  LucideBadgePercent,
  LucideCircleDollarSign,
  LucideTicketPercent,
  LucideCalendarRange,
  LucideHeartHandshake,
  LucideBuilding2,
  LucideHandCoins,
  LucideCircleHelp
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

@Component({
  selector:
    'app-discount-type-badge',

  standalone:
    true,

  imports: [
    TranslationPipe,
    LucideBadgePercent,
    LucideCircleDollarSign,
    LucideTicketPercent,
    LucideCalendarRange,
    LucideHeartHandshake,
    LucideBuilding2,
    LucideHandCoins,
    LucideCircleHelp
  ],

  templateUrl:
    './discount-type-badge.component.html',

  styleUrl:
    './discount-type-badge.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class DiscountTypeBadgeComponent {

  readonly type =
    input<string | null | undefined>();

  readonly translationKey =
    computed(() => {

      switch (
        this.type()
      ) {
        case 'Percentage':
          return 'discounts.types.percentage';

        case 'FixedAmount':
          return 'discounts.types.fixedAmount';

        case 'PromoCode':
          return 'discounts.types.promoCode';

        case 'Seasonal':
          return 'discounts.types.seasonal';

        case 'Loyalty':
          return 'discounts.types.loyalty';

        case 'Corporate':
          return 'discounts.types.corporate';

        case 'Manual':
          return 'discounts.types.manual';

        case 'Other':
          return 'discounts.types.other';

        default:
          return 'discounts.types.unknown';
      }
    });
}
