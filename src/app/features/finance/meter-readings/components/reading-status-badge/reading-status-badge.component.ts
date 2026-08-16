import {
  ChangeDetectionStrategy,
  Component,
  input
} from '@angular/core';

import {
  LucideCircleCheck,
  LucideTrash2
} from '@lucide/angular';

@Component({
  selector:
    'app-reading-status-badge',

  standalone:
    true,

  imports: [
    LucideCircleCheck,
    LucideTrash2
  ],

  templateUrl:
    './reading-status-badge.component.html',

  styleUrl:
    './reading-status-badge.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class ReadingStatusBadgeComponent {

  readonly deleted =
    input<boolean | null | undefined>();
}
