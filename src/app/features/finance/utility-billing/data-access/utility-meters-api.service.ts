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
  UtilityMeter,
  UtilityMeterQuery,
  UtilityMeterRequest
} from '../models/utility-meter.model';

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
export class UtilityMetersApiService {

  private readonly http =
    inject(HttpClient);

  private readonly baseUrl =
    '/api/v1/utility-meters';

  getAll(
    query: UtilityMeterQuery = {}
  ): Observable<PagedResult<UtilityMeter>> {

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
        PagedResult<UtilityMeter> |
        ApiEnvelope<PagedResult<UtilityMeter>>
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
  ): Observable<UtilityMeter> {

    return this.http
      .get<
        UtilityMeter |
        ApiEnvelope<UtilityMeter>
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
    request: UtilityMeterRequest
  ): Observable<UtilityMeter> {

    return this.http
      .post<
        UtilityMeter |
        ApiEnvelope<UtilityMeter>
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
    request: UtilityMeterRequest
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
