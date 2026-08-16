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
  UtilityRate,
  UtilityRateQuery,
  UtilityRateRequest
} from '../models/utility-rate.model';

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
export class UtilityRatesApiService {

  private readonly http =
    inject(HttpClient);

  private readonly baseUrl =
    '/api/v1/utility-rates';

  getAll(
    query: UtilityRateQuery = {}
  ): Observable<PagedResult<UtilityRate>> {

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

    if (query.utilityId) {
      params = params.set(
        'utilityId',
        query.utilityId
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
        PagedResult<UtilityRate> |
        ApiEnvelope<PagedResult<UtilityRate>>
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
  ): Observable<UtilityRate> {

    return this.http
      .get<
        UtilityRate |
        ApiEnvelope<UtilityRate>
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
    request: UtilityRateRequest
  ): Observable<UtilityRate> {

    return this.http
      .post<
        UtilityRate |
        ApiEnvelope<UtilityRate>
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
    request: UtilityRateRequest
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
