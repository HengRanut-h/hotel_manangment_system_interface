import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

import {
  RouterLink
} from '@angular/router';

import {
  LucideChartNoAxesCombined,
  LucideCircleDollarSign,
  LucideBedDouble,
  LucideArrowRight
} from '@lucide/angular';

@Component({
  selector:
    'app-reports-home-page',

  standalone:
    true,

  imports: [
    RouterLink,
    LucideChartNoAxesCombined,
    LucideCircleDollarSign,
    LucideBedDouble,
    LucideArrowRight
  ],

  templateUrl:
    './reports-home.page.html',

  styleUrl:
    './reports-home.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class ReportsHomePage {}
