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
  ChangeTransportationStatusRequest,
  CreateTransportationRequest,
  PagedResult,
  TransportationQuery,
  TransportationRequest,
  UpdateTransportationRequest
} from '../models/transportation.model';

@Injectable({
  providedIn: 'root'
})
export class TransportationApiService {

  private readonly api =
    inject(ApiClientService);

  getPage(
    query: TransportationQuery = {}
  ): Observable<PagedResult<TransportationRequest>> {

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
        ApiResponse<PagedResult<TransportationRequest>>
        |
        PagedResult<TransportationRequest>
      >(
        'transportation',
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
  ): Observable<TransportationRequest> {

    return this.api
      .get<
        ApiResponse<TransportationRequest>
        |
        TransportationRequest
      >(
        `transportation/${id}`
      )
      .pipe(
        map(
          response =>
            this.unwrap(response)
        )
      );
  }

  create(
    request: CreateTransportationRequest
  ): Observable<TransportationRequest> {

    return this.api
      .post<
        ApiResponse<TransportationRequest>
        |
        TransportationRequest
      >(
        'transportation',
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
    request: UpdateTransportationRequest
  ): Observable<TransportationRequest> {

    return this.api
      .put<
        ApiResponse<TransportationRequest>
        |
        TransportationRequest
      >(
        `transportation/${id}`,
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
    request: ChangeTransportationStatusRequest
  ): Observable<TransportationRequest> {

    return this.api
      .patch<
        ApiResponse<TransportationRequest>
        |
        TransportationRequest
      >(
        `transportation/${id}/status`,
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
        `transportation/${id}`
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
