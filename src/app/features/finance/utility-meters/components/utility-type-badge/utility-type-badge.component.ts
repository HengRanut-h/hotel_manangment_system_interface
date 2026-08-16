import {
  ChangeDetectionStrategy,
  Component,
  input
} from '@angular/core';

import {
  LucideZap,
  LucideDroplets,
  LucideFlame,
  LucideWifi,
  LucideCircleHelp
} from '@lucide/angular';

@Component({
  selector:
    'app-meter-utility-type-badge',

  standalone:
    true,

  imports: [
    LucideZap,
    LucideDroplets,
    LucideFlame,
    LucideWifi,
    LucideCircleHelp
  ],

  templateUrl:
    './utility-type-badge.component.html',

  styleUrl:
    './utility-type-badge.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class UtilityTypeBadgeComponent {

  readonly type =
    input<string | null | undefined>();
}
