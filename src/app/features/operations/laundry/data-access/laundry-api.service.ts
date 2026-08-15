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
  ChangeLaundryStatusRequest,
  CreateLaundryRequest,
  LaundryQuery,
  LaundryRequest,
  PagedResult,
  UpdateLaundryRequest
} from '../models/laundry.model';

@Injectable({
  providedIn: 'root'
})
export class LaundryApiService {

  private readonly api =
    inject(ApiClientService);

  getPage(
    query: LaundryQuery = {}
  ): Observable<PagedResult<LaundryRequest>> {

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
      params['search'] = search;
    }

    if (status) {
      params['status'] = status;
    }

    if (relatedEntityType) {
      params['relatedEntityType'] =
        relatedEntityType;
    }

    if (from) {
      params['from'] = from;
    }

    if (to) {
      params['to'] = to;
    }

    return this.api
      .get<
        ApiResponse<PagedResult<LaundryRequest>>
        |
        PagedResult<LaundryRequest>
      >(
        'laundry',
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
  ): Observable<LaundryRequest> {

    return this.api
      .get<
        ApiResponse<LaundryRequest>
        |
        LaundryRequest
      >(
        `laundry/${id}`
      )
      .pipe(
        map(
          response =>
            this.unwrap(response)
        )
      );
  }

  create(
    request: CreateLaundryRequest
  ): Observable<LaundryRequest> {

    return this.api
      .post<
        ApiResponse<LaundryRequest>
        |
        LaundryRequest
      >(
        'laundry',
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
    request: UpdateLaundryRequest
  ): Observable<LaundryRequest> {

    return this.api
      .put<
        ApiResponse<LaundryRequest>
        |
        LaundryRequest
      >(
        `laundry/${id}`,
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
    request: ChangeLaundryStatusRequest
  ): Observable<LaundryRequest> {

    return this.api
      .patch<
        ApiResponse<LaundryRequest>
        |
        LaundryRequest
      >(
        `laundry/${id}/status`,
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
        `laundry/${id}`
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
}
