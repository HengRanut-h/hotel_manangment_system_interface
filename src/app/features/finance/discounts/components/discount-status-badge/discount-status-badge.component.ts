import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
    'app-discount-status-badge',

  standalone:
    true,

  imports: [
    TranslationPipe,
    LucideCircleCheck,
    LucideCircleX,
    LucideTrash2
  ],

  templateUrl:
    './discount-status-badge.component.html',

  styleUrl:
    './discount-status-badge.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class DiscountStatusBadgeComponent {

  readonly active =
    input<boolean | null | undefined>();

  readonly deleted =
    input<boolean | null | undefined>();

  readonly className =
    computed(() => {

      if (
        this.deleted()
      ) {
        return 'deleted';
      }

      return this.active()
        ? 'active'
        : 'inactive';
    });

  readonly translationKey =
    computed(() => {

      if (
        this.deleted()
      ) {
        return 'discounts.status.deleted';
      }

      return this.active()
        ? 'discounts.status.active'
        : 'discounts.status.inactive';
    });
}
