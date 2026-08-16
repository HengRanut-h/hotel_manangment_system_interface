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
    'app-active-status-badge',

  standalone:
    true,

  imports: [
    TranslationPipe,
    LucideCircleCheck,
    LucideCircleX,
    LucideTrash2
  ],

  templateUrl:
    './active-status-badge.component.html',

  styleUrl:
    './active-status-badge.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class ActiveStatusBadgeComponent {

  readonly active =
    input<boolean | null | undefined>();

  readonly deleted =
    input<boolean | null | undefined>();
}
