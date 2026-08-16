import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input
} from '@angular/core';

import {
  LucideClock3,
  LucideCircleCheck,
  LucideLoaderCircle,
  LucideCircleX,
  LucideBan,
  LucideCircleHelp
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

@Component({
  selector:
    'app-refund-status-badge',

  standalone:
    true,

  imports: [
    TranslationPipe,
    LucideClock3,
    LucideCircleCheck,
    LucideLoaderCircle,
    LucideCircleX,
    LucideBan,
    LucideCircleHelp
  ],

  templateUrl:
    './refund-status-badge.component.html',

  styleUrl:
    './refund-status-badge.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class RefundStatusBadgeComponent {

  readonly status =
    input<string | null | undefined>();

  readonly className =
    computed(() => {

      switch (
        this.status()
      ) {

        case 'Pending':
          return 'pending';

        case 'Approved':
          return 'approved';

        case 'Processing':
          return 'processing';

        case 'Completed':
          return 'completed';

        case 'Rejected':
          return 'rejected';

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
          return 'refunds.status.pending';

        case 'Approved':
          return 'refunds.status.approved';

        case 'Processing':
          return 'refunds.status.processing';

        case 'Completed':
          return 'refunds.status.completed';

        case 'Rejected':
          return 'refunds.status.rejected';

        case 'Cancelled':
          return 'refunds.status.cancelled';

        default:
          return 'refunds.status.unknown';
      }
    });
}
