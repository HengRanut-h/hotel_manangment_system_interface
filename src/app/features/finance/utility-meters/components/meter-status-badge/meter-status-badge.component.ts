import {
  ChangeDetectionStrategy,
  Component,
  input
} from '@angular/core';

import {
  LucideCircleCheck,
  LucideCircleX,
  LucideTrash2
} from '@lucide/angular';

@Component({
  selector:
    'app-meter-status-badge',

  standalone:
    true,

  imports: [
    LucideCircleCheck,
    LucideCircleX,
    LucideTrash2
  ],

  templateUrl:
    './meter-status-badge.component.html',

  styleUrl:
    './meter-status-badge.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class MeterStatusBadgeComponent {

  readonly active =
    input<boolean | null | undefined>();

  readonly deleted =
    input<boolean | null | undefined>();
}
