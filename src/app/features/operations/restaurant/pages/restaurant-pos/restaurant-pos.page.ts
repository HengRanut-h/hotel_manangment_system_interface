import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  RouterLink
} from '@angular/router';

import {
  catchError,
  concatMap,
  from,
  map,
  of,
  switchMap,
  toArray
} from 'rxjs';

import {
  LucideChefHat,
  LucideListFilter,
  LucideRefreshCw,
  LucideSearch,
  LucideSettings2,
  LucideShoppingCart,
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
  MenuCategoryTabsComponent
} from '../../components/menu-category-tabs/menu-category-tabs.component';

import {
  MenuItemCardComponent
} from '../../components/menu-item-card/menu-item-card.component';

import {
  PosCartComponent
} from '../../components/pos-cart/pos-cart.component';

import {
  RestaurantApiService
} from '../../data-access/restaurant-api.service';

import {
  MenuItem,
  RestaurantMenu
} from '../../models/restaurant.model';

import {
  RestaurantPosStore
} from '../../state/restaurant-pos.store';

@Component({
  selector:
    'app-restaurant-pos-page',

  standalone:
    true,

  imports: [
    RouterLink,
    TranslationPipe,
    SpinComponent,
    MenuCategoryTabsComponent,
    MenuItemCardComponent,
    PosCartComponent,
    LucideChefHat,
    LucideListFilter,
    LucideRefreshCw,
    LucideSearch,
    LucideSettings2,
    LucideShoppingCart,
    LucideUtensils
  ],

  templateUrl:
    './restaurant-pos.page.html',

  styleUrl:
    './restaurant-pos.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class RestaurantPosPage
  implements OnInit {

  readonly auth =
    inject(AuthStore);

  readonly store =
    inject(RestaurantPosStore);

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

  readonly errorMessage =
    signal('');

  readonly search =
    signal('');

  readonly selectedCategoryId =
    signal<string | null>(null);

  readonly roomId =
    signal('');

  readonly guestId =
    signal('');

  readonly availableItems =
    computed(
      () =>
        this.menu()
          .items
          .filter(
            item =>
              item.isAvailable
          )
          .length
    );

  readonly visibleCategories =
    computed(
      () =>
        this.menu()
          .categories
          .filter(
            category =>
              category.isActive
          )
    );

  readonly filteredItems =
    computed(
      () => {

        const search =
          this.search()
            .trim()
            .toLowerCase();

        const categoryId =
          this.selectedCategoryId();

        return this.menu()
          .items
          .filter(
            item => {

              if (
                categoryId
                &&
                item.categoryId
                !==
                categoryId
              ) {
                return false;
              }

              if (
                search
                &&
                !item.name
                  .toLowerCase()
                  .includes(search)
              ) {
                return false;
              }

              return true;
            }
          );
      }
    );

  readonly canCreateOrder =
    computed(
      () =>
        this.auth.hasPermission(
          'restaurant.orders'
        )
    );

  ngOnInit(): void {

    this.loadMenu();
  }

  loadMenu(): void {

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

  setSearch(
    event: Event
  ): void {

    const target =
      event.target;

    if (
      !(target instanceof HTMLInputElement)
    ) {
      return;
    }

    this.search.set(
      target.value
    );
  }

  setCategory(
    categoryId: string | null
  ): void {

    this.selectedCategoryId.set(
      categoryId
    );
  }

  setRoomId(
    event: Event
  ): void {

    const target =
      event.target;

    if (
      !(target instanceof HTMLInputElement)
    ) {
      return;
    }

    this.roomId.set(
      target.value
    );
  }

  setGuestId(
    event: Event
  ): void {

    const target =
      event.target;

    if (
      !(target instanceof HTMLInputElement)
    ) {
      return;
    }

    this.guestId.set(
      target.value
    );
  }

  addItem(
    item: MenuItem
  ): void {

    this.store.add(item);
  }

  createOrder(): void {

    if (
      !this.canCreateOrder()
      ||
      this.store.submitting()
      ||
      this.store.cartItems()
        .length === 0
    ) {
      return;
    }

    const cartSnapshot =
      this.store.cartItems()
        .map(
          item => ({
            menuItem:
              item.menuItem,

            quantity:
              item.quantity
          })
        );

    this.store.submitting.set(true);
    this.store.partialFailure.set(false);
    this.store.createdOrder.set(null);

    this.api
      .createOrder({
        roomId:
          this.normalizeOptional(
            this.roomId()
          ),

        guestId:
          this.normalizeOptional(
            this.guestId()
          )
      })
      .pipe(
        switchMap(
          order => {

            this.store.createdOrder.set(
              order
            );

            return from(
              cartSnapshot
            )
              .pipe(
                concatMap(
                  cartItem =>
                    this.api
                      .addOrderItem(
                        order.id,
                        {
                          menuItemId:
                            cartItem
                              .menuItem
                              .id,

                          quantity:
                            cartItem
                              .quantity
                        }
                      )
                      .pipe(
                        map(
                          () => ({
                            success: true,
                            cartItem
                          })
                        ),

                        catchError(
                          () =>
                            of({
                              success: false,
                              cartItem
                            })
                        )
                      )
                ),
                toArray(),
                map(
                  results => ({
                    order,
                    results
                  })
                )
              );
          }
        )
      )
      .subscribe({

        next:
          result => {

            this.store.submitting.set(false);

            const failed =
              result.results
                .filter(
                  item =>
                    !item.success
                );

            if (
              failed.length > 0
            ) {
              this.store.partialFailure.set(
                true
              );

              this.toast.error(
                this.translation.translate(
                  'restaurant.partialOrderFailure'
                )
              );

              return;
            }

            this.toast.success(
              this.translation.translate(
                'restaurant.orderCreated',
                {
                  number:
                    result.order.orderNumber
                    ||
                    result.order.id
                }
              )
            );

            this.store.clear();
            this.roomId.set('');
            this.guestId.set('');
          },

        error:
          error => {

            this.store.submitting.set(false);

            if (
              this.store.createdOrder()
            ) {
              this.store.partialFailure.set(
                true
              );

              this.toast.error(
                this.translation.translate(
                  'restaurant.partialOrderFailure'
                )
              );

              return;
            }

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'restaurant.createOrderFailed'
                )
              )
            );
          }
      });
  }

  private normalizeOptional(
    value: string
  ): string | null {

    const normalized =
      value.trim();

    return normalized
      ? normalized
      : null;
  }
}
