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
  ChangePurchaseOrderStatusRequest,
  CreatePurchaseOrderRequest,
  SupplierLookupItem,
  PagedResult,
  PurchaseOrder,
  PurchaseOrderQuery,
  UpdatePurchaseOrderRequest
} from '../models/purchase-order.model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrdersApiService {

  private readonly api =
    inject(ApiClientService);

  getPage(
    query: PurchaseOrderQuery = {}
  ): Observable<PagedResult<PurchaseOrder>> {

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
        ApiResponse<PagedResult<PurchaseOrder>>
        |
        PagedResult<PurchaseOrder>
      >(
        'purchase-orders',
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
  ): Observable<PurchaseOrder> {

    return this.api
      .get<
        ApiResponse<PurchaseOrder>
        |
        PurchaseOrder
      >(
        `purchase-orders/${id}`
      )
      .pipe(
        map(
          response =>
            this.unwrap(response)
        )
      );
  }

  create(
    request: CreatePurchaseOrderRequest
  ): Observable<unknown> {

    return this.api
      .post<unknown>(
        'purchase-orders',
        request
      );
  }

  update(
    id: string,
    request: UpdatePurchaseOrderRequest
  ): Observable<unknown> {

    return this.api
      .put<unknown>(
        `purchase-orders/${id}`,
        request
      );
  }

  changeStatus(
    id: string,
    request: ChangePurchaseOrderStatusRequest
  ): Observable<unknown> {

    return this.api
      .patch<unknown>(
        `purchase-orders/${id}/status`,
        request
      );
  }

  delete(
    id: string
  ): Observable<void> {

    return this.api
      .delete<void>(
        `purchase-orders/${id}`
      );
  }

  getSuppliers():
    Observable<SupplierLookupItem[]> {

    return this.api
      .get<
        ApiResponse<
          SupplierLookupItem[]
          |
          PagedResult<SupplierLookupItem>
        >
        |
        SupplierLookupItem[]
        |
        PagedResult<SupplierLookupItem>
      >(
        'suppliers'
      )
      .pipe(
        map(
          response =>
            this.normalizeSuppliers(
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

  private normalizeSuppliers(
    response:
      SupplierLookupItem[]
      |
      PagedResult<SupplierLookupItem>
  ): SupplierLookupItem[] {

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
