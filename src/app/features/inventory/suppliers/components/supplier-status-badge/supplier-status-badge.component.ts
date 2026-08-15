import {
  ChangeDetectionStrategy,
  Component,
  input
} from '@angular/core';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

@Component({
  selector:
    'app-supplier-status-badge',

  standalone:
    true,

  imports: [
    TranslationPipe
  ],

  templateUrl:
    './supplier-status-badge.component.html',

  styleUrl:
    './supplier-status-badge.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class SupplierStatusBadgeComponent {

  readonly isActive =
    input(true);
}
