import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input
} from '@angular/core';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

@Component({
  selector:
    'app-room-change-status-badge',

  standalone:
    true,

  imports: [
    TranslationPipe
  ],

  templateUrl:
    './room-change-status-badge.component.html',

  styleUrl:
    './room-change-status-badge.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class RoomChangeStatusBadgeComponent {

  readonly status =
    input<string | null | undefined>();

  readonly className =
    computed(() => {

      switch (
        this.status()
      ) {

        case 'Completed':
          return 'completed';

        case 'Approved':
          return 'approved';

        case 'Pending':
          return 'pending';

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
          return 'roomChanges.status.pending';

        case 'Approved':
          return 'roomChanges.status.approved';

        case 'Completed':
          return 'roomChanges.status.completed';

        case 'Rejected':
          return 'roomChanges.status.rejected';

        case 'Cancelled':
          return 'roomChanges.status.cancelled';

        default:
          return 'roomChanges.status.unknown';
      }
    });
}
