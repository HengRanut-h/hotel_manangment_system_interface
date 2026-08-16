import {
  ChangeDetectionStrategy,
  Component,
  input
} from '@angular/core';

import {
  LucideClock3,
  LucideLoaderCircle,
  LucideCircleCheck,
  LucideCircleX,
  LucideBan
} from '@lucide/angular';

@Component({
  selector:
    'app-report-status-badge',

  standalone:
    true,

  imports: [
    LucideClock3,
    LucideLoaderCircle,
    LucideCircleCheck,
    LucideCircleX,
    LucideBan
  ],

  templateUrl:
    './report-status-badge.component.html',

  styleUrl:
    './report-status-badge.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class ReportStatusBadgeComponent {

  readonly status =
    input<string | null | undefined>();
}
