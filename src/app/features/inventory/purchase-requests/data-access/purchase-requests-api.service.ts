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
  ChangePurchaseRequestStatusRequest,
  CreatePurchaseRequestRequest,
  InventoryLookupItem,
  PagedResult,
  PurchaseRequest,
  PurchaseRequestQuery,
  UpdatePurchaseRequestRequest
} from '../models/purchase-request.model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseRequestsApiService {

  private readonly api =
    inject(ApiClientService);

  getPage(
    query: PurchaseRequestQuery = {}
  ): Observable<PagedResult<PurchaseRequest>> {

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
        ApiResponse<PagedResult<PurchaseRequest>>
        |
        PagedResult<PurchaseRequest>
      >(
        'purchase-requests',
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
  ): Observable<PurchaseRequest> {

    return this.api
      .get<
        ApiResponse<PurchaseRequest>
        |
        PurchaseRequest
      >(
        `purchase-requests/${id}`
      )
      .pipe(
        map(
          response =>
            this.unwrap(response)
        )
      );
  }

  create(
    request: CreatePurchaseRequestRequest
  ): Observable<unknown> {

    return this.api
      .post<unknown>(
        'purchase-requests',
        request
      );
  }

  update(
    id: string,
    request: UpdatePurchaseRequestRequest
  ): Observable<unknown> {

    return this.api
      .put<unknown>(
        `purchase-requests/${id}`,
        request
      );
  }

  changeStatus(
    id: string,
    request: ChangePurchaseRequestStatusRequest
  ): Observable<unknown> {

    return this.api
      .patch<unknown>(
        `purchase-requests/${id}/status`,
        request
      );
  }

  delete(
    id: string
  ): Observable<void> {

    return this.api
      .delete<void>(
        `purchase-requests/${id}`
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
