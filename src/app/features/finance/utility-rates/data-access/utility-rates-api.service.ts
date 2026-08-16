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
  UtilityRateActiveRequest,
  UtilityRatePagedResult,
  UtilityRateQuery,
  UtilityRateUpsertRequest
} from '../models/utility-rate.model';

interface ApiEnvelope<T> {
  success?: boolean;
  status?: number;
  code?: string;
  message?: string;
  data: T;
}

type ListResponse =
  | UtilityRatePagedResult
  | ApiEnvelope<UtilityRatePagedResult>;

type DetailResponse =
  | UtilityRate
  | ApiEnvelope<UtilityRate>;

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
  ): Observable<UtilityRatePagedResult> {

    let params =
      new HttpParams();

    if (
      query.pageNumber !== undefined
    ) {
      params =
        params.set(
          'pageNumber',
          query.pageNumber
        );
    }

    if (
      query.pageSize !== undefined
    ) {
      params =
        params.set(
          'pageSize',
          query.pageSize
        );
    }

    if (
      query.search?.trim()
    ) {
      params =
        params.set(
          'search',
          query.search.trim()
        );
    }

    if (
      query.utilityId
    ) {
      params =
        params.set(
          'utilityId',
          query.utilityId
        );
    }

    if (
      query.utilityType
    ) {
      params =
        params.set(
          'utilityType',
          query.utilityType
        );
    }

    if (
      query.isActive !== undefined
    ) {
      params =
        params.set(
          'isActive',
          query.isActive
        );
    }

    if (
      query.sortBy
    ) {
      params =
        params.set(
          'sortBy',
          query.sortBy
        );
    }

    if (
      query.sortDirection
    ) {
      params =
        params.set(
          'sortDirection',
          query.sortDirection
        );
    }

    return this.http
      .get<ListResponse>(
        this.baseUrl,
        {
          params
        }
      )
      .pipe(
        map(
          response =>
            this.unwrap(
              response
            )
        )
      );
  }

  getById(
    id: string
  ): Observable<UtilityRate> {

    return this.http
      .get<DetailResponse>(
        `${this.baseUrl}/${id}`
      )
      .pipe(
        map(
          response =>
            this.unwrap(
              response
            )
        )
      );
  }

  create(
    request: UtilityRateUpsertRequest
  ): Observable<UtilityRate> {

    return this.http
      .post<DetailResponse>(
        this.baseUrl,
        request
      )
      .pipe(
        map(
          response =>
            this.unwrap(
              response
            )
        )
      );
  }

  update(
    id: string,
    request: UtilityRateUpsertRequest
  ): Observable<unknown> {

    return this.http
      .put(
        `${this.baseUrl}/${id}`,
        request
      );
  }

  delete(
    id: string
  ): Observable<void> {

    return this.http
      .delete<void>(
        `${this.baseUrl}/${id}`
      );
  }

  setActive(
    id: string,
    isActive: boolean
  ): Observable<unknown> {

    const request:
      UtilityRateActiveRequest =
    {
      isActive
    };

    return this.http
      .patch(
        `${this.baseUrl}/${id}/active`,
        request
      );
  }

  restore(
    id: string
  ): Observable<unknown> {

    return this.http
      .post(
        `${this.baseUrl}/${id}/restore`,
        {}
      );
  }

  private unwrap<T>(
    response:
      T | ApiEnvelope<T>
  ): T {

    if (
      response &&
      typeof response ===
        'object' &&
      'data' in response
    ) {
      return (
        response as
          ApiEnvelope<T>
      ).data;
    }

    return response as T;
  }
}
