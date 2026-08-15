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
  CreateWarehouseRequest,
  PagedResult,
  UpdateWarehouseRequest,
  Warehouse
} from '../models/warehouse.model';

@Injectable({
  providedIn: 'root'
})
export class WarehousesApiService {

  private readonly api =
    inject(ApiClientService);

  getAll():
    Observable<Warehouse[]> {

    return this.api
      .get<
        ApiResponse<
          Warehouse[]
          |
          PagedResult<Warehouse>
        >
        |
        Warehouse[]
        |
        PagedResult<Warehouse>
      >(
        'warehouses'
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
  ): Observable<Warehouse> {

    return this.api
      .get<
        ApiResponse<Warehouse>
        |
        Warehouse
      >(
        `warehouses/${id}`
      )
      .pipe(
        map(
          response =>
            this.unwrap(response)
        )
      );
  }

  create(
    request: CreateWarehouseRequest
  ): Observable<unknown> {

    return this.api
      .post<unknown>(
        'warehouses',
        request
      );
  }

  update(
    id: string,
    request: UpdateWarehouseRequest
  ): Observable<unknown> {

    return this.api
      .put<unknown>(
        `warehouses/${id}`,
        request
      );
  }

  delete(
    id: string
  ): Observable<void> {

    return this.api
      .delete<void>(
        `warehouses/${id}`
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
      Warehouse[]
      |
      PagedResult<Warehouse>
  ): Warehouse[] {

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
