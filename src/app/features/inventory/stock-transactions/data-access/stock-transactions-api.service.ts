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
  ChangeStockTransactionStatusRequest,
  CreateStockTransactionRequest,
  InventoryLookupItem,
  PagedResult,
  StockTransaction,
  StockTransactionQuery,
  UpdateStockTransactionRequest
} from '../models/stock-transaction.model';

@Injectable({
  providedIn: 'root'
})
export class StockTransactionsApiService {

  private readonly api =
    inject(ApiClientService);

  getPage(
    query: StockTransactionQuery = {}
  ): Observable<PagedResult<StockTransaction>> {

    const params:
      Record<string, string | number> = {
        sortBy:
          query.sortBy ?? 'createdAt',

        sortDirection:
          query.sortDirection ?? 'desc',

        pageNumber:
          query.pageNumber ?? 1,

        pageSize:
          query.pageSize ?? 20
      };

    const search =
      query.search?.trim();

    const status =
      query.status?.trim();

    const relatedEntityType =
      query.relatedEntityType?.trim();

    const from =
      query.from?.trim();

    const to =
      query.to?.trim();

    if (search) {
      params['search'] =
        search;
    }

    if (status) {
      params['status'] =
        status;
    }

    if (relatedEntityType) {
      params['relatedEntityType'] =
        relatedEntityType;
    }

    if (from) {
      params['from'] =
        from;
    }

    if (to) {
      params['to'] =
        to;
    }

    return this.api
      .get<
        ApiResponse<PagedResult<StockTransaction>>
        |
        PagedResult<StockTransaction>
      >(
        'stock-transactions',
        params
      )
      .pipe(
        map(
          response =>
            this.unwrap(response)
        )
      );
  }

  getById(
    id: string
  ): Observable<StockTransaction> {

    return this.api
      .get<
        ApiResponse<StockTransaction>
        |
        StockTransaction
      >(
        `stock-transactions/${id}`
      )
      .pipe(
        map(
          response =>
            this.unwrap(response)
        )
      );
  }

  create(
    request: CreateStockTransactionRequest
  ): Observable<StockTransaction> {

    return this.api
      .post<
        ApiResponse<StockTransaction>
        |
        StockTransaction
      >(
        'stock-transactions',
        request
      )
      .pipe(
        map(
          response =>
            this.unwrap(response)
        )
      );
  }

  update(
    id: string,
    request: UpdateStockTransactionRequest
  ): Observable<StockTransaction> {

    return this.api
      .put<
        ApiResponse<StockTransaction>
        |
        StockTransaction
      >(
        `stock-transactions/${id}`,
        request
      )
      .pipe(
        map(
          response =>
            this.unwrap(response)
        )
      );
  }

  changeStatus(
    id: string,
    request: ChangeStockTransactionStatusRequest
  ): Observable<StockTransaction> {

    return this.api
      .patch<
        ApiResponse<StockTransaction>
        |
        StockTransaction
      >(
        `stock-transactions/${id}/status`,
        request
      )
      .pipe(
        map(
          response =>
            this.unwrap(response)
        )
      );
  }

  delete(
    id: string
  ): Observable<void> {

    return this.api
      .delete<void>(
        `stock-transactions/${id}`
      );
  }

  getInventoryItems():
    Observable<InventoryLookupItem[]> {

    return this.api
      .get<
        ApiResponse<
          InventoryLookupItem[]
          |
          PagedResult<InventoryLookupItem>
        >
        |
        InventoryLookupItem[]
        |
        PagedResult<InventoryLookupItem>
      >(
        'inventory'
      )
      .pipe(
        map(
          response =>
            this.normalizeInventoryItems(
              this.unwrap(response)
            )
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

  private normalizeInventoryItems(
    response:
      InventoryLookupItem[]
      |
      PagedResult<InventoryLookupItem>
  ): InventoryLookupItem[] {

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
