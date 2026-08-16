import {
  ChangeDetectionStrategy,
  Component,
  input
} from '@angular/core';

import {
  LucideInfo,
  LucideCircleCheck,
  LucideTriangleAlert,
  LucideCircleX,
  LucideCalendarCheck,
  LucideCreditCard,
  LucideSparkles,
  LucideWrench,
  LucideBell,
  LucideCircleHelp
} from '@lucide/angular';

@Component({
  selector:
    'app-notification-type-badge',

  standalone:
    true,

  imports: [
    LucideInfo,
    LucideCircleCheck,
    LucideTriangleAlert,
    LucideCircleX,
    LucideCalendarCheck,
    LucideCreditCard,
    LucideSparkles,
    LucideWrench,
    LucideBell,
    LucideCircleHelp
  ],

  templateUrl:
    './notification-type-badge.component.html',

  styleUrl:
    './notification-type-badge.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class NotificationTypeBadgeComponent {

  readonly type =
    input<string | null | undefined>();
}
