import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input
} from '@angular/core';

import {
  LucideBanknote,
  LucideCreditCard,
  LucideLandmark,
  LucideSmartphone,
  LucideGlobe2,
  LucideCircleHelp
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

@Component({
  selector:
    'app-payment-method-badge',

  standalone:
    true,

  imports: [
    TranslationPipe,
    LucideBanknote,
    LucideCreditCard,
    LucideLandmark,
    LucideSmartphone,
    LucideGlobe2,
    LucideCircleHelp
  ],

  templateUrl:
    './payment-method-badge.component.html',

  styleUrl:
    './payment-method-badge.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class PaymentMethodBadgeComponent {

  readonly method =
    input<string | null | undefined>();

  readonly className =
    computed(() => {

      switch (
        this.method()
      ) {

        case 'Cash':
          return 'cash';

        case 'Card':
          return 'card';

        case 'BankTransfer':
          return 'bank';

        case 'MobilePayment':
          return 'mobile';

        case 'Online':
          return 'online';

        default:
          return 'neutral';
      }
    });

  readonly translationKey =
    computed(() => {

      switch (
        this.method()
      ) {

        case 'Cash':
          return 'payments.methods.cash';

        case 'Card':
          return 'payments.methods.card';

        case 'BankTransfer':
          return 'payments.methods.bankTransfer';

        case 'MobilePayment':
          return 'payments.methods.mobilePayment';

        case 'Cheque':
          return 'payments.methods.cheque';

        case 'Online':
          return 'payments.methods.online';

        case 'Other':
          return 'payments.methods.other';

        default:
          return 'payments.methods.unknown';
      }
    });
}
