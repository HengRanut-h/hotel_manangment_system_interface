import {
  ChangeDetectionStrategy,
  Component,
  input
} from '@angular/core';

import {
  DecimalPipe
} from '@angular/common';

import {
  LucideBed,
  LucideLayers,
  LucideTrendingDown,
  LucideTrendingUp
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  AvailabilitySearchSummary
} from '../../models/availability.model';

@Component({
  selector:
    'app-availability-stats',

  standalone:
    true,

  imports: [
    DecimalPipe,
    TranslationPipe,

    LucideBed,
    LucideLayers,
    LucideTrendingDown,
    LucideTrendingUp
  ],

  templateUrl:
    './availability-stats.component.html',

  styleUrl:
    './availability-stats.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class AvailabilityStatsComponent {

  readonly summary =
    input.required<
      AvailabilitySearchSummary
    >();
}
