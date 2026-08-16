import {
  ChangeDetectionStrategy,
  Component,
  input
} from '@angular/core';

import {
  LucideFlag
} from '@lucide/angular';

@Component({
  selector:
    'app-notification-priority-badge',

  standalone:
    true,

  imports: [
    LucideFlag
  ],

  templateUrl:
    './notification-priority-badge.component.html',

  styleUrl:
    './notification-priority-badge.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class NotificationPriorityBadgeComponent {

  readonly priority =
    input<string | null | undefined>();
}
