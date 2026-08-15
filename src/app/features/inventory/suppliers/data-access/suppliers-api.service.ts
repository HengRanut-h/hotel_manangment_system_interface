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
  CreateSupplierRequest,
  PagedResult,
  UpdateSupplierRequest,
  Supplier
} from '../models/supplier.model';

@Injectable({
  providedIn: 'root'
})
export class SuppliersApiService {

  private readonly api =
    inject(ApiClientService);

  getAll():
    Observable<Supplier[]> {

    return this.api
      .get<
        ApiResponse<
          Supplier[]
          |
          PagedResult<Supplier>
        >
        |
        Supplier[]
        |
        PagedResult<Supplier>
      >(
        'suppliers'
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

  getById(
    id: string
  ): Observable<Supplier> {

    return this.api
      .get<
        ApiResponse<Supplier>
        |
        Supplier
      >(
        `suppliers/${id}`
      )
      .pipe(
        map(
          response =>
            this.unwrap(response)
        )
      );
  }

  create(
    request: CreateSupplierRequest
  ): Observable<unknown> {

    return this.api
      .post<unknown>(
        'suppliers',
        request
      );
  }

  update(
    id: string,
    request: UpdateSupplierRequest
  ): Observable<unknown> {

    return this.api
      .put<unknown>(
        `suppliers/${id}`,
        request
      );
  }

  delete(
    id: string
  ): Observable<void> {

    return this.api
      .delete<void>(
        `suppliers/${id}`
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
      Supplier[]
      |
      PagedResult<Supplier>
  ): Supplier[] {

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
