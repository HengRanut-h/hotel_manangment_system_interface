import {
  ChangeDetectionStrategy,
  Component,
  input
} from '@angular/core';

import {
  LucideType,
  LucideHash,
  LucideToggleLeft,
  LucideBraces
} from '@lucide/angular';

@Component({
  selector:
    'app-setting-type-badge',

  standalone:
    true,

  imports: [
    LucideType,
    LucideHash,
    LucideToggleLeft,
    LucideBraces
  ],

  templateUrl:
    './setting-type-badge.component.html',

  styleUrl:
    './setting-type-badge.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class SettingTypeBadgeComponent {

  readonly type =
    input<string | null | undefined>();
}
