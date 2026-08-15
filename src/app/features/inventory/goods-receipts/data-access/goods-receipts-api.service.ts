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
  ChangeGoodsReceiptStatusRequest,
  CreateGoodsReceiptRequest,
  PurchaseOrderLookupItem,
  PagedResult,
  GoodsReceipt,
  GoodsReceiptQuery,
  UpdateGoodsReceiptRequest
} from '../models/goods-receipt.model';

@Injectable({
  providedIn: 'root'
})
export class GoodsReceiptsApiService {

  private readonly api =
    inject(ApiClientService);

  getPage(
    query: GoodsReceiptQuery = {}
  ): Observable<PagedResult<GoodsReceipt>> {

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
        ApiResponse<PagedResult<GoodsReceipt>>
        |
        PagedResult<GoodsReceipt>
      >(
        'goods-receipts',
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
  ): Observable<GoodsReceipt> {

    return this.api
      .get<
        ApiResponse<GoodsReceipt>
        |
        GoodsReceipt
      >(
        `goods-receipts/${id}`
      )
      .pipe(
        map(
          response =>
            this.unwrap(response)
        )
      );
  }

  create(
    request: CreateGoodsReceiptRequest
  ): Observable<unknown> {

    return this.api
      .post<unknown>(
        'goods-receipts',
        request
      );
  }

  update(
    id: string,
    request: UpdateGoodsReceiptRequest
  ): Observable<unknown> {

    return this.api
      .put<unknown>(
        `goods-receipts/${id}`,
        request
      );
  }

  changeStatus(
    id: string,
    request: ChangeGoodsReceiptStatusRequest
  ): Observable<unknown> {

    return this.api
      .patch<unknown>(
        `goods-receipts/${id}/status`,
        request
      );
  }

  delete(
    id: string
  ): Observable<void> {

    return this.api
      .delete<void>(
        `goods-receipts/${id}`
      );
  }

  getPurchaseOrders():
    Observable<PurchaseOrderLookupItem[]> {

    return this.api
      .get<
        ApiResponse<
          PurchaseOrderLookupItem[]
          |
          PagedResult<PurchaseOrderLookupItem>
        >
        |
        PurchaseOrderLookupItem[]
        |
        PagedResult<PurchaseOrderLookupItem>
      >(
        'purchase-orders'
      )
      .pipe(
        map(
          response =>
            this.normalizePurchaseOrders(
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

  private normalizePurchaseOrders(
    response:
      PurchaseOrderLookupItem[]
      |
      PagedResult<PurchaseOrderLookupItem>
  ): PurchaseOrderLookupItem[] {

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
