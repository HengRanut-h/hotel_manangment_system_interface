import {
  Injectable,
  inject
} from '@angular/core';

import {
  Observable,
  map
} from 'rxjs';

import {
  ApiClientService
} from '../../../../core/http/api-client.service';

import {
  ApiResponse,
  CreateGuestServiceRequest,
  GuestService,
  GuestServicePagedResult,
  GuestServiceQuery,
  UpdateGuestServiceRequest
} from '../models/guest-services.model';

@Injectable({
  providedIn: 'root'
})
export class GuestServicesApiService {

  private readonly api =
    inject(ApiClientService);

  getPage(
    query: GuestServiceQuery = {}
  ): Observable<GuestServicePagedResult> {

    return this.api
      .get<
        ApiResponse<GuestServicePagedResult>
        |
        GuestServicePagedResult
      >(
        this.buildListUrl(query)
      )
      .pipe(
        map(response =>
          this.unwrap(response)
        )
      );
  }

  getById(
    id: string
  ): Observable<GuestService> {

    return this.api
      .get<
        ApiResponse<GuestService>
        |
        GuestService
      >(
        `services/${id}`
      )
      .pipe(
        map(response =>
          this.unwrap(response)
        )
      );
  }

  create(
    request: CreateGuestServiceRequest
  ): Observable<GuestService> {

    return this.api
      .post<
        ApiResponse<GuestService>
        |
        GuestService
      >(
        'services',
        request
      )
      .pipe(
        map(response =>
          this.unwrap(response)
        )
      );
  }

  update(
    id: string,
    request: UpdateGuestServiceRequest
  ): Observable<GuestService> {

    return this.api
      .put<
        ApiResponse<GuestService>
        |
        GuestService
      >(
        `services/${id}`,
        request
      )
      .pipe(
        map(response =>
          this.unwrap(response)
        )
      );
  }

  delete(
    id: string
  ): Observable<void> {

    return this.api
      .delete<void>(
        `services/${id}`
      );
  }

  private buildListUrl(
    query: GuestServiceQuery
  ): string {

    const params =
      new URLSearchParams();

    const search =
      query.search?.trim();

    if (search) {
      params.set(
        'search',
        search
      );
    }

    if (
      query.isActive !== null
      &&
      query.isActive !== undefined
    ) {
      params.set(
        'isActive',
        String(query.isActive)
      );
    }

    params.set(
      'sortBy',
      query.sortBy ?? 'name'
    );

    params.set(
      'sortDirection',
      query.sortDirection ?? 'asc'
    );

    params.set(
      'pageNumber',
      String(query.pageNumber ?? 1)
    );

    params.set(
      'pageSize',
      String(query.pageSize ?? 20)
    );

    const value =
      params.toString();

    return value
      ? `services?${value}`
      : 'services';
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
