import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

import {
  Injectable,
  inject
} from '@angular/core';

import {
  Observable,
  map
} from 'rxjs';

import {
  Utility,
  UtilityQuery,
  UtilityRequest
} from '../models/utility.model';

import {
  ApiEnvelope,
  PagedResult
} from '../models/paged-result.model';

import {
  unwrapApi
} from './api-response.util';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesApiService {

  private readonly http =
    inject(HttpClient);

  private readonly baseUrl =
    '/api/v1/utilities';

  getAll(
    query: UtilityQuery = {}
  ): Observable<PagedResult<Utility>> {

    let params =
      new HttpParams();

    if (query.pageNumber !== undefined) {
      params = params.set(
        'pageNumber',
        query.pageNumber
      );
    }

    if (query.pageSize !== undefined) {
      params = params.set(
        'pageSize',
        query.pageSize
      );
    }

    if (query.search?.trim()) {
      params = params.set(
        'search',
        query.search.trim()
      );
    }

    if (query.type) {
      params = params.set(
        'type',
        query.type
      );
    }

    if (query.isActive !== undefined) {
      params = params.set(
        'isActive',
        query.isActive
      );
    }

    return this.http
      .get<
        PagedResult<Utility> |
        ApiEnvelope<PagedResult<Utility>>
      >(
        this.baseUrl,
        {
          params
        }
      )
      .pipe(
        map(
          response =>
            unwrapApi(
              response
            )
        )
      );
  }

  getById(
    id: string
  ): Observable<Utility> {

    return this.http
      .get<
        Utility |
        ApiEnvelope<Utility>
      >(
        `${this.baseUrl}/${id}`
      )
      .pipe(
        map(
          response =>
            unwrapApi(
              response
            )
        )
      );
  }

  create(
    request: UtilityRequest
  ): Observable<Utility> {

    return this.http
      .post<
        Utility |
        ApiEnvelope<Utility>
      >(
        this.baseUrl,
        request
      )
      .pipe(
        map(
          response =>
            unwrapApi(
              response
            )
        )
      );
  }

  update(
    id: string,
    request: UtilityRequest
  ): Observable<unknown> {

    return this.http.put(
      `${this.baseUrl}/${id}`,
      request
    );
  }

  delete(
    id: string
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.baseUrl}/${id}`
    );
  }

  setActive(
    id: string,
    isActive: boolean
  ): Observable<unknown> {

    return this.http.patch(
      `${this.baseUrl}/${id}/active`,
      {
        isActive
      }
    );
  }

  restore(
    id: string
  ): Observable<unknown> {

    return this.http.post(
      `${this.baseUrl}/${id}/restore`,
      {}
    );
  }
}
