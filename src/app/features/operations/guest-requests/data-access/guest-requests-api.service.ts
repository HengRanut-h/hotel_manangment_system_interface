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
  ChangeGuestRequestStatusRequest,
  CreateGuestRequestRequest,
  GuestRequest,
  GuestRequestQuery,
  PagedResult,
  UpdateGuestRequestRequest
} from '../models/guest-request.model';

@Injectable({
  providedIn: 'root'
})
export class GuestRequestsApiService {

  private readonly api =
    inject(ApiClientService);

  getPage(
    query: GuestRequestQuery = {}
  ): Observable<PagedResult<GuestRequest>> {

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
        ApiResponse<PagedResult<GuestRequest>>
        |
        PagedResult<GuestRequest>
      >(
        'guest-requests',
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
  ): Observable<GuestRequest> {

    return this.api
      .get<
        ApiResponse<GuestRequest>
        |
        GuestRequest
      >(
        `guest-requests/${id}`
      )
      .pipe(
        map(
          response =>
            this.unwrap(response)
        )
      );
  }

  create(
    request: CreateGuestRequestRequest
  ): Observable<GuestRequest> {

    return this.api
      .post<
        ApiResponse<GuestRequest>
        |
        GuestRequest
      >(
        'guest-requests',
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
    request: UpdateGuestRequestRequest
  ): Observable<GuestRequest> {

    return this.api
      .put<
        ApiResponse<GuestRequest>
        |
        GuestRequest
      >(
        `guest-requests/${id}`,
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
    request: ChangeGuestRequestStatusRequest
  ): Observable<GuestRequest> {

    return this.api
      .patch<
        ApiResponse<GuestRequest>
        |
        GuestRequest
      >(
        `guest-requests/${id}/status`,
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
        `guest-requests/${id}`
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
