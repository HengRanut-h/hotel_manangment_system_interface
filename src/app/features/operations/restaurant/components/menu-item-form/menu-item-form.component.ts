import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal
} from '@angular/core';

import {
  LucideCheck
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  CreateMenuItemRequest,
  MenuCategory
} from '../../models/restaurant.model';

@Component({
  selector:
    'app-menu-item-form',

  standalone:
    true,

  imports: [
    TranslationPipe,
    LucideCheck
  ],

  templateUrl:
    './menu-item-form.component.html',

  styleUrl:
    './menu-item-form.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class MenuItemFormComponent {

  readonly categories =
    input<MenuCategory[]>([]);

  readonly submitted =
    output<CreateMenuItemRequest>();

  readonly categoryId =
    signal('');

  readonly name =
    signal('');

  readonly price =
    signal('');

  readonly isAvailable =
    signal(true);

  readonly touched =
    signal(false);

  setCategory(
    event: Event
  ): void {

    const target =
      event.target;

    if (
      !(target instanceof HTMLSelectElement)
    ) {
      return;
    }

    this.categoryId.set(
      target.value
    );
  }

  setName(
    event: Event
  ): void {

    const target =
      event.target;

    if (
      !(target instanceof HTMLInputElement)
    ) {
      return;
    }

    this.name.set(
      target.value
    );
  }

  setPrice(
    event: Event
  ): void {

    const target =
      event.target;

    if (
      !(target instanceof HTMLInputElement)
    ) {
      return;
    }

    this.price.set(
      target.value
    );
  }

  setAvailable(
    event: Event
  ): void {

    const target =
      event.target;

    if (
      !(target instanceof HTMLInputElement)
    ) {
      return;
    }

    this.isAvailable.set(
      target.checked
    );
  }

  submit(): void {

    this.touched.set(true);

    const categoryId =
      this.categoryId()
        .trim();

    const name =
      this.name()
        .trim();

    const price =
      Number(
        this.price()
      );

    if (
      !categoryId
      ||
      !name
      ||
      !Number.isFinite(price)
      ||
      price < 0
    ) {
      return;
    }

    this.submitted.emit({
      categoryId,
      name,
      price,
      isAvailable:
        this.isAvailable()
    });
  }

  reset(): void {

    this.categoryId.set('');
    this.name.set('');
    this.price.set('');
    this.isAvailable.set(true);
    this.touched.set(false);
  }
}
