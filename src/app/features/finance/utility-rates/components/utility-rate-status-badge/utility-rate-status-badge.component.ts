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

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

@Component({
  selector:
    'app-utility-rate-status-badge',

  standalone:
    true,

  imports: [
    TranslationPipe,
    LucideCircleCheck,
    LucideCircleX,
    LucideTrash2
  ],

  templateUrl:
    './utility-rate-status-badge.component.html',

  styleUrl:
    './utility-rate-status-badge.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class UtilityRateStatusBadgeComponent {

  readonly active =
    input<boolean | null | undefined>();

  readonly deleted =
    input<boolean | null | undefined>();
}
