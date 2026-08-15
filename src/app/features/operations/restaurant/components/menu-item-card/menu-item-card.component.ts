import {
  ChangeDetectionStrategy,
  Component,
  input,
  output
} from '@angular/core';

import {
  DecimalPipe
} from '@angular/common';

import {
  LucidePlus,
  LucideUtensils
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  MenuItem
} from '../../models/restaurant.model';

@Component({
  selector:
    'app-menu-item-card',

  standalone:
    true,

  imports: [
    DecimalPipe,
    TranslationPipe,
    LucidePlus,
    LucideUtensils
  ],

  templateUrl:
    './menu-item-card.component.html',

  styleUrl:
    './menu-item-card.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class MenuItemCardComponent {

  readonly item =
    input.required<MenuItem>();

  readonly canOrder =
    input(true);

  readonly add =
    output<MenuItem>();

  addItem(): void {

    const item =
      this.item();

    if (
      !item.isAvailable
      ||
      !this.canOrder()
    ) {
      return;
    }

    this.add.emit(item);
  }
}
