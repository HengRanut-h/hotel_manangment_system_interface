import {
  ChangeDetectionStrategy,
  Component,
  input
} from '@angular/core';

import {
  LucideCircleCheck,
  LucideCircleX,
  LucideCircleHelp
} from '@lucide/angular';

@Component({
  selector:
    'app-audit-result-badge',

  standalone:
    true,

  imports: [
    LucideCircleCheck,
    LucideCircleX,
    LucideCircleHelp
  ],

  templateUrl:
    './audit-result-badge.component.html',

  styleUrl:
    './audit-result-badge.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class AuditResultBadgeComponent {

  readonly succeeded =
    input<boolean | null | undefined>();
}
