import {
  ChangeDetectionStrategy,
  Component,
  input,
  output
} from '@angular/core';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  MenuCategory
} from '../../models/restaurant.model';

@Component({
  selector:
    'app-menu-category-tabs',

  standalone:
    true,

  imports: [
    TranslationPipe
  ],

  templateUrl:
    './menu-category-tabs.component.html',

  styleUrl:
    './menu-category-tabs.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class MenuCategoryTabsComponent {

  readonly categories =
    input<MenuCategory[]>([]);

  readonly selectedId =
    input<string | null>(null);

  readonly selected =
    output<string | null>();

  choose(
    id: string | null
  ): void {

    this.selected.emit(id);
  }
}
