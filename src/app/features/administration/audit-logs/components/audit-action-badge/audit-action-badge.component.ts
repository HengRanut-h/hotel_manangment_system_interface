import {
  ChangeDetectionStrategy,
  Component,
  input
} from '@angular/core';

import {
  LucidePlus,
  LucidePencil,
  LucideTrash2,
  LucideEye,
  LucideLogIn,
  LucideLogOut,
  LucideRotateCcw,
  LucideShield,
  LucideActivity
} from '@lucide/angular';

@Component({
  selector:
    'app-audit-action-badge',

  standalone:
    true,

  imports: [
    LucidePlus,
    LucidePencil,
    LucideTrash2,
    LucideEye,
    LucideLogIn,
    LucideLogOut,
    LucideRotateCcw,
    LucideShield,
    LucideActivity
  ],

  templateUrl:
    './audit-action-badge.component.html',

  styleUrl:
    './audit-action-badge.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class AuditActionBadgeComponent {

  readonly action =
    input<string | null | undefined>();
}
