import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input
} from '@angular/core';

import {
  LucideCalendarX2,
  LucideCircleDollarSign,
  LucideMessageSquareWarning,
  LucideCopy,
  LucideLandmark,
  LucideCircleHelp
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

@Component({
  selector:
    'app-refund-reason-badge',

  standalone:
    true,

  imports: [
    TranslationPipe,
    LucideCalendarX2,
    LucideCircleDollarSign,
    LucideMessageSquareWarning,
    LucideCopy,
    LucideLandmark,
    LucideCircleHelp
  ],

  templateUrl:
    './refund-reason-badge.component.html',

  styleUrl:
    './refund-reason-badge.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class RefundReasonBadgeComponent {

  readonly reason =
    input<string | null | undefined>();

  readonly translationKey =
    computed(() => {

      switch (
        this.reason()
      ) {

        case 'Cancellation':
          return 'refunds.reasons.cancellation';

        case 'Overpayment':
          return 'refunds.reasons.overpayment';

        case 'ServiceIssue':
          return 'refunds.reasons.serviceIssue';

        case 'DuplicatePayment':
          return 'refunds.reasons.duplicatePayment';

        case 'DepositReturn':
          return 'refunds.reasons.depositReturn';

        case 'Other':
          return 'refunds.reasons.other';

        default:
          return 'refunds.reasons.unknown';
      }
    });
}
