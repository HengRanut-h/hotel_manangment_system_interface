import {
  ChangeDetectionStrategy,
  Component,
  input
} from '@angular/core';

import {
  LucideBanknote,
  LucideCreditCard,
  LucideLandmark,
  LucideWalletCards
} from '@lucide/angular';

@Component({
  selector:
    'app-payment-method-badge',

  standalone:
    true,

  imports: [
    LucideBanknote,
    LucideCreditCard,
    LucideLandmark,
    LucideWalletCards
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
}
