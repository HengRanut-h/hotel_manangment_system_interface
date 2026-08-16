import {
  ChangeDetectionStrategy,
  Component,
  input
} from '@angular/core';

import {
  LucideZap,
  LucideDroplets,
  LucideFlame,
  LucideWifi,
  LucideCircleHelp
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

@Component({
  selector:
    'app-utility-rate-type-badge',

  standalone:
    true,

  imports: [
    TranslationPipe,
    LucideZap,
    LucideDroplets,
    LucideFlame,
    LucideWifi,
    LucideCircleHelp
  ],

  templateUrl:
    './utility-type-badge.component.html',

  styleUrl:
    './utility-type-badge.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class UtilityTypeBadgeComponent {

  readonly type =
    input<string | null | undefined>();
}
