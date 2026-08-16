import {
  ChangeDetectionStrategy,
  Component,
  input
} from '@angular/core';

import {
  LucideCrown
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

@Component({
  selector: 'app-guest-vip-badge',
  standalone: true,
  imports: [
    TranslationPipe,
    LucideCrown
  ],
  templateUrl: './guest-vip-badge.component.html',
  styleUrl: './guest-vip-badge.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GuestVipBadgeComponent {
  readonly isVip = input(false);
}
