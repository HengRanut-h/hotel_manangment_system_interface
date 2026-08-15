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
    'app-warehouse-status-badge',

  standalone:
    true,

  imports: [
    TranslationPipe
  ],

  templateUrl:
    './warehouse-status-badge.component.html',

  styleUrl:
    './warehouse-status-badge.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class WarehouseStatusBadgeComponent {

  readonly isActive =
    input(true);
}
