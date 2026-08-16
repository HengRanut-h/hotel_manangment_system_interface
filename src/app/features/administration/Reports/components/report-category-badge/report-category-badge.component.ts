import {
  ChangeDetectionStrategy,
  Component,
  input
} from '@angular/core';

import {
  LucideChartNoAxesCombined,
  LucideCircleDollarSign,
  LucideBedDouble,
  LucideSparkles,
  LucideWrench,
  LucideBoxes,
  LucideShoppingCart,
  LucideUsers,
  LucideShield,
  LucideGauge,
  LucideBuilding2,
  LucideCircleHelp
} from '@lucide/angular';

@Component({
  selector:
    'app-report-category-badge',

  standalone:
    true,

  imports: [
    LucideChartNoAxesCombined,
    LucideCircleDollarSign,
    LucideBedDouble,
    LucideSparkles,
    LucideWrench,
    LucideBoxes,
    LucideShoppingCart,
    LucideUsers,
    LucideShield,
    LucideGauge,
    LucideBuilding2,
    LucideCircleHelp
  ],

  templateUrl:
    './report-category-badge.component.html',

  styleUrl:
    './report-category-badge.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class ReportCategoryBadgeComponent {

  readonly category =
    input<string | null | undefined>();
}
