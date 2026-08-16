import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input
} from '@angular/core';

import {
  LucideCircleCheck,
  LucideClock3,
  LucideCircleX,
  LucideBan,
  LucideRotateCcw,
  LucideCircleHelp
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

@Component({
  selector:
    'app-payment-status-badge',

  standalone:
    true,

  imports: [
    TranslationPipe,
    LucideCircleCheck,
    LucideClock3,
    LucideCircleX,
    LucideBan,
    LucideRotateCcw,
    LucideCircleHelp
  ],

  templateUrl:
    './payment-status-badge.component.html',

  styleUrl:
    './payment-status-badge.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class PaymentStatusBadgeComponent {

  readonly status =
    input<string | null | undefined>();

  readonly className =
    computed(() => {

      switch (
        this.status()
      ) {

        case 'Completed':
          return 'completed';

        case 'Pending':
          return 'pending';

        case 'Failed':
          return 'failed';

        case 'Cancelled':
          return 'cancelled';

        case 'Refunded':
          return 'refunded';

        default:
          return 'neutral';
      }
    });

  readonly translationKey =
    computed(() => {

      switch (
        this.status()
      ) {

        case 'Completed':
          return 'payments.status.completed';

        case 'Pending':
          return 'payments.status.pending';

        case 'Failed':
          return 'payments.status.failed';

        case 'Cancelled':
          return 'payments.status.cancelled';

        case 'Refunded':
          return 'payments.status.refunded';

        default:
          return 'payments.status.unknown';
      }
    });
}
