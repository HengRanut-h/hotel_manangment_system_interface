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
  LucideMinus,
  LucidePlus,
  LucideShoppingBag,
  LucideTrash2
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  PosCartItem
} from '../../models/restaurant.model';

@Component({
  selector:
    'app-pos-cart',

  standalone:
    true,

  imports: [
    DecimalPipe,
    TranslationPipe,
    LucideMinus,
    LucidePlus,
    LucideShoppingBag,
    LucideTrash2
  ],

  templateUrl:
    './pos-cart.component.html',

  styleUrl:
    './pos-cart.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class PosCartComponent {

  readonly items =
    input<PosCartItem[]>([]);

  readonly subtotal =
    input(0);

  readonly disabled =
    input(false);

  readonly increment =
    output<string>();

  readonly decrement =
    output<string>();

  readonly remove =
    output<string>();

  increase(
    id: string
  ): void {

    if (!this.disabled()) {
      this.increment.emit(id);
    }
  }

  decrease(
    id: string
  ): void {

    if (!this.disabled()) {
      this.decrement.emit(id);
    }
  }

  removeItem(
    id: string
  ): void {

    if (!this.disabled()) {
      this.remove.emit(id);
    }
  }
}
