import {
  ChangeDetectionStrategy,
  Component,
  input
} from '@angular/core';

import {
  LucideToggleLeft,
  LucideToggleRight,
  LucideTrash2
} from '@lucide/angular';

@Component({
  selector:
    'app-feature-flag-status-badge',

  standalone:
    true,

  imports: [
    LucideToggleLeft,
    LucideToggleRight,
    LucideTrash2
  ],

  templateUrl:
    './feature-flag-status-badge.component.html',

  styleUrl:
    './feature-flag-status-badge.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class FeatureFlagStatusBadgeComponent {

  readonly enabled =
    input<boolean | null | undefined>();

  readonly deleted =
    input<boolean | null | undefined>();
}
