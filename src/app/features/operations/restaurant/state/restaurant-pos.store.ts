import {
  computed,
  Injectable,
  signal
} from '@angular/core';

import {
  MenuItem,
  PosCartItem,
  RestaurantOrder
} from '../models/restaurant.model';

@Injectable({
  providedIn: 'root'
})
export class RestaurantPosStore {

  readonly cartItems =
    signal<PosCartItem[]>([]);

  readonly submitting =
    signal(false);

  readonly createdOrder =
    signal<RestaurantOrder | null>(null);

  readonly partialFailure =
    signal(false);

  readonly subtotal =
    computed(
      () =>
        this.cartItems()
          .reduce(
            (
              total,
              item
            ) =>
              total
              +
              item.menuItem.price
              *
              item.quantity,
            0
          )
    );

  readonly totalQuantity =
    computed(
      () =>
        this.cartItems()
          .reduce(
            (
              total,
              item
            ) =>
              total
              +
              item.quantity,
            0
          )
    );

  add(
    menuItem: MenuItem
  ): void {

    if (
      !menuItem.isAvailable
      ||
      this.submitting()
    ) {
      return;
    }

    this.cartItems.update(
      items => {

        const index =
          items.findIndex(
            item =>
              item.menuItem.id
              ===
              menuItem.id
          );

        if (index < 0) {
          return [
            ...items,
            {
              menuItem,
              quantity: 1
            }
          ];
        }

        return items.map(
          (
            item,
            itemIndex
          ) =>
            itemIndex === index
              ? {
                  ...item,
                  quantity:
                    item.quantity + 1
                }
              : item
        );
      }
    );
  }

  increment(
    menuItemId: string
  ): void {

    if (this.submitting()) {
      return;
    }

    this.cartItems.update(
      items =>
        items.map(
          item =>
            item.menuItem.id
            ===
            menuItemId
              ? {
                  ...item,
                  quantity:
                    item.quantity + 1
                }
              : item
        )
    );
  }

  decrement(
    menuItemId: string
  ): void {

    if (this.submitting()) {
      return;
    }

    this.cartItems.update(
      items =>
        items
          .map(
            item =>
              item.menuItem.id
              ===
              menuItemId
                ? {
                    ...item,
                    quantity:
                      item.quantity - 1
                  }
                : item
          )
          .filter(
            item =>
              item.quantity > 0
          )
    );
  }

  remove(
    menuItemId: string
  ): void {

    if (this.submitting()) {
      return;
    }

    this.cartItems.update(
      items =>
        items.filter(
          item =>
            item.menuItem.id
            !==
            menuItemId
        )
    );
  }

  clear(): void {

    if (this.submitting()) {
      return;
    }

    this.cartItems.set([]);
    this.createdOrder.set(null);
    this.partialFailure.set(false);
  }
}
