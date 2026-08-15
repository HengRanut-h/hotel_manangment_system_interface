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
  ApiResponse,
  CreateInventoryItemRequest,
  InventoryItem,
  PagedResult
} from '../models/inventory-item.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryItemsApiService {

  private readonly api =
    inject(ApiClientService);

  getAll():
    Observable<InventoryItem[]> {

    return this.api
      .get<
        ApiResponse<
          InventoryItem[]
          |
          PagedResult<InventoryItem>
        >
        |
        InventoryItem[]
        |
        PagedResult<InventoryItem>
      >(
        'inventory'
      )
      .pipe(
        map(
          response =>
            this.normalizeList(
              this.unwrap(response)
            )
        )
      );
  }

  create(
    request: CreateInventoryItemRequest
  ): Observable<InventoryItem> {

    return this.api
      .post<
        ApiResponse<InventoryItem>
        |
        InventoryItem
      >(
        'inventory',
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

  private normalizeList(
    response:
      InventoryItem[]
      |
      PagedResult<InventoryItem>
  ): InventoryItem[] {

    if (
      Array.isArray(response)
    ) {
      return response;
    }

    if (
      response
      &&
      Array.isArray(
        response.items
      )
    ) {
      return response.items;
    }

    return [];
  }
}
