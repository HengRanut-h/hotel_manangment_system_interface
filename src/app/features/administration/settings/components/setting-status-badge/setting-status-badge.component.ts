import {
  ChangeDetectionStrategy,
  Component,
  input
} from '@angular/core';

import {
  LucideCircleCheck,
  LucideCircleX,
  LucideTrash2,
  LucideLockKeyhole
} from '@lucide/angular';

@Component({
  selector:
    'app-setting-status-badge',

  standalone:
    true,

  imports: [
    LucideCircleCheck,
    LucideCircleX,
    LucideTrash2,
    LucideLockKeyhole
  ],

  templateUrl:
    './setting-status-badge.component.html',

  styleUrl:
    './setting-status-badge.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class SettingStatusBadgeComponent {

  readonly active =
    input<boolean | null | undefined>();

  readonly deleted =
    input<boolean | null | undefined>();

  readonly readOnly =
    input<boolean | null | undefined>();
}
