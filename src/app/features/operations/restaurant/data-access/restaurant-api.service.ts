import {
  inject,
  Injectable
} from '@angular/core';

import {
  map,
  Observable
} from 'rxjs';

import {
  ApiClientService
} from '../../../../core/http/api-client.service';

import {
  AddRestaurantOrderItemRequest,
  ApiResponse,
  CreateMenuCategoryRequest,
  CreateMenuItemRequest,
  CreateRestaurantOrderRequest,
  MenuCategory,
  MenuItem,
  RestaurantMenu,
  RestaurantOrder,
  RestaurantOrderItem
} from '../models/restaurant.model';

@Injectable({
  providedIn: 'root'
})
export class RestaurantApiService {

  private readonly api =
    inject(ApiClientService);

  getMenu():
    Observable<RestaurantMenu> {

    return this.api
      .get<
        ApiResponse<unknown>
        |
        unknown
      >(
        'restaurant/menu'
      )
      .pipe(
        map(
          response =>
            this.normalizeMenu(
              this.unwrap(response)
            )
        )
      );
  }

  createCategory(
    request: CreateMenuCategoryRequest
  ): Observable<MenuCategory> {

    return this.api
      .post<
        ApiResponse<MenuCategory>
        |
        MenuCategory
      >(
        'restaurant/categories',
        request
      )
      .pipe(
        map(
          response =>
            this.unwrap(response)
        )
      );
  }

  createItem(
    request: CreateMenuItemRequest
  ): Observable<MenuItem> {

    return this.api
      .post<
        ApiResponse<MenuItem>
        |
        MenuItem
      >(
        'restaurant/items',
        request
      )
      .pipe(
        map(
          response =>
            this.unwrap(response)
        )
      );
  }

  createOrder(
    request: CreateRestaurantOrderRequest
  ): Observable<RestaurantOrder> {

    return this.api
      .post<
        ApiResponse<RestaurantOrder>
        |
        RestaurantOrder
      >(
        'restaurant/orders',
        request
      )
      .pipe(
        map(
          response =>
            this.unwrap(response)
        )
      );
  }

  addOrderItem(
    orderId: string,
    request: AddRestaurantOrderItemRequest
  ): Observable<RestaurantOrderItem> {

    return this.api
      .post<
        ApiResponse<RestaurantOrderItem>
        |
        RestaurantOrderItem
      >(
        `restaurant/orders/${orderId}/items`,
        request
      )
      .pipe(
        map(
          response =>
            this.unwrap(response)
        )
      );
  }

  private unwrap<T>(
    response: ApiResponse<T> | T
  ): T {

    if (
      response !== null
      &&
      typeof response === 'object'
      &&
      'data' in response
    ) {
      return (
        response as ApiResponse<T>
      ).data;
    }

    return response as T;
  }

  private normalizeMenu(
    value: unknown
  ): RestaurantMenu {

    if (
      value !== null
      &&
      typeof value === 'object'
      &&
      !Array.isArray(value)
    ) {
      const record =
        value as Record<string, unknown>;

      const categories =
        this.asCategoryArray(
          record['categories']
        );

      const items =
        this.asItemArray(
          record['items']
        );

      if (
        categories.length > 0
        ||
        items.length > 0
      ) {
        return this.attachCategoryNames(
          categories,
          items
        );
      }
    }

    if (
      Array.isArray(value)
    ) {
      const categories =
        this.asCategoryArray(value);

      const nestedItems =
        categories
          .flatMap(
            category =>
              Array.isArray(
                category.items
              )
                ? category.items
                : []
          );

      if (
        categories.length > 0
      ) {
        return this.attachCategoryNames(
          categories,
          nestedItems
        );
      }

      const items =
        this.asItemArray(value);

      return {
        categories: [],
        items
      };
    }

    return {
      categories: [],
      items: []
    };
  }

  private asCategoryArray(
    value: unknown
  ): MenuCategory[] {

    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .filter(
        item => {

          if (
            item === null
            ||
            typeof item !== 'object'
          ) {
            return false;
          }

          const record =
            item as Record<string, unknown>;

          return (
            typeof record['name']
            === 'string'
            &&
            !(
              'price' in record
              ||
              'categoryId' in record
            )
          );
        }
      )
      .map(
        item => {

          const record =
            item as Record<string, unknown>;

          const nestedItems =
            this.asItemArray(
              record['items']
            );

          return {
            id:
              String(
                record['id']
                ??
                ''
              ),

            hotelId:
              typeof record['hotelId']
              === 'string'
                ? record['hotelId']
                : undefined,

            name:
              String(
                record['name']
                ??
                ''
              ),

            isActive:
              record['isActive']
              !== false,

            createdAtUtc:
              typeof record['createdAtUtc']
              === 'string'
                ? record['createdAtUtc']
                : undefined,

            items:
              nestedItems
          };
        }
      );
  }

  private asItemArray(
    value: unknown
  ): MenuItem[] {

    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .filter(
        item =>
          item !== null
          &&
          typeof item === 'object'
          &&
          typeof (
            item as Record<string, unknown>
          )['name'] === 'string'
          &&
          (
            'price' in (
              item as Record<string, unknown>
            )
            ||
            'categoryId' in (
              item as Record<string, unknown>
            )
          )
      )
      .map(
        item => {

          const record =
            item as Record<string, unknown>;

          return {
            id:
              String(
                record['id']
                ??
                ''
              ),

            hotelId:
              typeof record['hotelId']
              === 'string'
                ? record['hotelId']
                : undefined,

            categoryId:
              String(
                record['categoryId']
                ??
                ''
              ),

            categoryName:
              typeof record['categoryName']
              === 'string'
                ? record['categoryName']
                : null,

            name:
              String(
                record['name']
                ??
                ''
              ),

            price:
              Number(
                record['price']
                ??
                0
              ),

            isAvailable:
              record['isAvailable']
              !== false,

            createdAtUtc:
              typeof record['createdAtUtc']
              === 'string'
                ? record['createdAtUtc']
                : undefined
          };
        }
      );
  }

  private attachCategoryNames(
    categories: MenuCategory[],
    items: MenuItem[]
  ): RestaurantMenu {

    const categoryNames =
      new Map(
        categories.map(
          category => [
            category.id,
            category.name
          ]
        )
      );

    const normalizedItems =
      items.map(
        item => ({
          ...item,

          categoryName:
            item.categoryName
            ??
            categoryNames.get(
              item.categoryId
            )
            ??
            null
        })
      );

    const byCategory =
      new Map<string, MenuItem[]>();

    for (
      const item
      of normalizedItems
    ) {
      const collection =
        byCategory.get(
          item.categoryId
        )
        ??
        [];

      collection.push(item);

      byCategory.set(
        item.categoryId,
        collection
      );
    }

    return {
      categories:
        categories.map(
          category => ({
            ...category,

            items:
              byCategory.get(
                category.id
              )
              ??
              category.items
              ??
              []
          })
        ),

      items:
        normalizedItems
    };
  }
}
