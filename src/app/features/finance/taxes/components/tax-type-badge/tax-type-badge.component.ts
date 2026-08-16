import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input
} from '@angular/core';

import {
  LucideBadgePercent,
  LucideBuilding2,
  LucideReceiptText,
  LucideMapPin,
  LucidePlane,
  LucideBedDouble,
  LucideCircleHelp
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

@Component({
  selector:
    'app-tax-type-badge',

  standalone:
    true,

  imports: [
    TranslationPipe,
    LucideBadgePercent,
    LucideBuilding2,
    LucideReceiptText,
    LucideMapPin,
    LucidePlane,
    LucideBedDouble,
    LucideCircleHelp
  ],

  templateUrl:
    './tax-type-badge.component.html',

  styleUrl:
    './tax-type-badge.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class TaxTypeBadgeComponent {

  readonly type =
    input<string | null | undefined>();

  readonly translationKey =
    computed(() => {

      switch (
        this.type()
      ) {

        case 'VAT':
          return 'taxes.types.vat';

        case 'GST':
          return 'taxes.types.gst';

        case 'ServiceTax':
          return 'taxes.types.serviceTax';

        case 'CityTax':
          return 'taxes.types.cityTax';

        case 'TourismTax':
          return 'taxes.types.tourismTax';

        case 'OccupancyTax':
          return 'taxes.types.occupancyTax';

        case 'Other':
          return 'taxes.types.other';

        default:
          return 'taxes.types.unknown';
      }
    });
}
