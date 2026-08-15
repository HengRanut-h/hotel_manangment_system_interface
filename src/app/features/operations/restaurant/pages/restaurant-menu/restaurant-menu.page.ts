import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  RouterLink
} from '@angular/router';

import {
  DecimalPipe
} from '@angular/common';

import {
  LucideArrowLeft,
  LucideChefHat,
  LucideRefreshCw,
  LucideUtensils
} from '@lucide/angular';

import {
  AuthStore
} from '../../../../../core/auth/auth.store';

import {
  getSafeApiErrorMessage
} from '../../../../../core/http/api-error.util';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  TranslationService
} from '../../../../../core/i18n/translation.service';

import {
  SpinComponent
} from '../../../../../shared/ui/spin/spin.component';

import {
  ToastService
} from '../../../../../shared/ui/toast/toast.service';

import {
  MenuCategoryFormComponent
} from '../../components/menu-category-form/menu-category-form.component';

import {
  MenuItemFormComponent
} from '../../components/menu-item-form/menu-item-form.component';

import {
  RestaurantApiService
} from '../../data-access/restaurant-api.service';

import {
  CreateMenuCategoryRequest,
  CreateMenuItemRequest,
  RestaurantMenu
} from '../../models/restaurant.model';

@Component({
  selector:
    'app-restaurant-menu-page',

  standalone:
    true,

  imports: [
    DecimalPipe,
    RouterLink,
    TranslationPipe,
    SpinComponent,
    MenuCategoryFormComponent,
    MenuItemFormComponent,
    LucideArrowLeft,
    LucideChefHat,
    LucideRefreshCw,
    LucideUtensils
  ],

  templateUrl:
    './restaurant-menu.page.html',

  styleUrl:
    './restaurant-menu.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class RestaurantMenuPage
  implements OnInit {

  readonly auth =
    inject(AuthStore);

  private readonly api =
    inject(RestaurantApiService);

  private readonly toast =
    inject(ToastService);

  private readonly translation =
    inject(TranslationService);

  readonly menu =
    signal<RestaurantMenu>({
      categories: [],
      items: []
    });

  readonly loading =
    signal(true);

  readonly creatingCategory =
    signal(false);

  readonly creatingItem =
    signal(false);

  readonly errorMessage =
    signal('');

  ngOnInit(): void {

    this.load();
  }

  load(): void {

    this.loading.set(true);
    this.errorMessage.set('');

    this.api
      .getMenu()
      .subscribe({

        next:
          menu => {

            this.menu.set(menu);
            this.loading.set(false);
          },

        error:
          error => {

            this.errorMessage.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'restaurant.loadFailed'
                )
              )
            );

            this.loading.set(false);
          }
      });
  }

  createCategory(
    request: CreateMenuCategoryRequest
  ): void {

    if (
      this.creatingCategory()
    ) {
      return;
    }

    this.creatingCategory.set(true);

    this.api
      .createCategory(request)
      .subscribe({

        next:
          () => {

            this.creatingCategory.set(false);

            this.toast.success(
              this.translation.translate(
                'restaurant.categoryCreated'
              )
            );

            this.load();
          },

        error:
          error => {

            this.creatingCategory.set(false);

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'restaurant.createCategoryFailed'
                )
              )
            );
          }
      });
  }

  createItem(
    request: CreateMenuItemRequest
  ): void {

    if (
      this.creatingItem()
    ) {
      return;
    }

    this.creatingItem.set(true);

    this.api
      .createItem(request)
      .subscribe({

        next:
          () => {

            this.creatingItem.set(false);

            this.toast.success(
              this.translation.translate(
                'restaurant.itemCreated'
              )
            );

            this.load();
          },

        error:
          error => {

            this.creatingItem.set(false);

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'restaurant.createItemFailed'
                )
              )
            );
          }
      });
  }
}
