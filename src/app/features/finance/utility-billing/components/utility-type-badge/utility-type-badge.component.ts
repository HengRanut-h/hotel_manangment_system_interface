import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input
} from '@angular/core';

import {
  LucideZap,
  LucideDroplets,
  LucideFlame,
  LucideWifi,
  LucideCircleHelp
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

@Component({
  selector:
    'app-utility-type-badge',

  standalone:
    true,

  imports: [
    TranslationPipe,
    LucideZap,
    LucideDroplets,
    LucideFlame,
    LucideWifi,
    LucideCircleHelp
  ],

  templateUrl:
    './utility-type-badge.component.html',

  styleUrl:
    './utility-type-badge.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class UtilityTypeBadgeComponent {

  readonly type =
    input<string | null | undefined>();

  readonly key =
    computed(() => {

      switch (
        this.type()
      ) {
        case 'Electricity':
          return 'utilityBilling.utilityTypes.electricity';

        case 'Water':
          return 'utilityBilling.utilityTypes.water';

        case 'Gas':
          return 'utilityBilling.utilityTypes.gas';

        case 'Internet':
          return 'utilityBilling.utilityTypes.internet';

        case 'Other':
          return 'utilityBilling.utilityTypes.other';

        default:
          return 'utilityBilling.utilityTypes.unknown';
      }
    });
}
