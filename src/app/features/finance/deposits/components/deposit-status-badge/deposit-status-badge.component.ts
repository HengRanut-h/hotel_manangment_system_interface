import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input
} from '@angular/core';

import {
  LucideCircleCheck,
  LucideClock3,
  LucideBan,
  LucideRotateCcw,
  LucideCircleHelp
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

@Component({
  selector:
    'app-deposit-status-badge',

  standalone:
    true,

  imports: [
    TranslationPipe,
    LucideCircleCheck,
    LucideClock3,
    LucideBan,
    LucideRotateCcw,
    LucideCircleHelp
  ],

  templateUrl:
    './deposit-status-badge.component.html',

  styleUrl:
    './deposit-status-badge.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class DepositStatusBadgeComponent {

  readonly status =
    input<string | null | undefined>();

  readonly className =
    computed(() => {

      switch (
        this.status()
      ) {

        case 'Received':
          return 'received';

        case 'Applied':
          return 'applied';

        case 'PartiallyApplied':
          return 'partial';

        case 'Refunded':
          return 'refunded';

        case 'PartiallyRefunded':
          return 'partial-refund';

        case 'Pending':
          return 'pending';

        case 'Cancelled':
          return 'cancelled';

        default:
          return 'neutral';
      }
    });

  readonly translationKey =
    computed(() => {

      switch (
        this.status()
      ) {

        case 'Pending':
          return 'deposits.status.pending';

        case 'Received':
          return 'deposits.status.received';

        case 'Applied':
          return 'deposits.status.applied';

        case 'PartiallyApplied':
          return 'deposits.status.partiallyApplied';

        case 'Refunded':
          return 'deposits.status.refunded';

        case 'PartiallyRefunded':
          return 'deposits.status.partiallyRefunded';

        case 'Cancelled':
          return 'deposits.status.cancelled';

        default:
          return 'deposits.status.unknown';
      }
    });
}
