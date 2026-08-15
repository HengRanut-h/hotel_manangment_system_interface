import {
  ChangeDetectionStrategy,
  Component,
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
  CreateMenuCategoryRequest
} from '../../models/restaurant.model';

@Component({
  selector:
    'app-menu-category-form',

  standalone:
    true,

  imports: [
    TranslationPipe,
    LucideCheck
  ],

  templateUrl:
    './menu-category-form.component.html',

  styleUrl:
    './menu-category-form.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class MenuCategoryFormComponent {

  readonly submitted =
    output<CreateMenuCategoryRequest>();

  readonly name =
    signal('');

  readonly touched =
    signal(false);

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

  submit(): void {

    this.touched.set(true);

    const name =
      this.name()
        .trim();

    if (!name) {
      return;
    }

    this.submitted.emit({
      name
    });
  }

  reset(): void {

    this.name.set('');
    this.touched.set(false);
  }
}
