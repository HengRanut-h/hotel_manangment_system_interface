import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input
} from '@angular/core';

import {
  LucideCircleDollarSign,
  LucideShieldCheck,
  LucideLandmark,
  LucideTriangleAlert,
  LucideCircleHelp
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

@Component({
  selector:
    'app-deposit-type-badge',

  standalone:
    true,

  imports: [
    TranslationPipe,
    LucideCircleDollarSign,
    LucideShieldCheck,
    LucideLandmark,
    LucideTriangleAlert,
    LucideCircleHelp
  ],

  templateUrl:
    './deposit-type-badge.component.html',

  styleUrl:
    './deposit-type-badge.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class DepositTypeBadgeComponent {

  readonly type =
    input<string | null | undefined>();

  readonly translationKey =
    computed(() => {

      switch (
        this.type()
      ) {

        case 'Reservation':
          return 'deposits.types.reservation';

        case 'Security':
          return 'deposits.types.security';

        case 'Advance':
          return 'deposits.types.advance';

        case 'Damage':
          return 'deposits.types.damage';

        case 'Other':
          return 'deposits.types.other';

        default:
          return 'deposits.types.unknown';
      }
    });
}
