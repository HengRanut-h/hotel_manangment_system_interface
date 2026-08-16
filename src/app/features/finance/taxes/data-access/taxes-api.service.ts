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
  Tax,
  TaxActiveRequest,
  TaxPagedResult,
  TaxQuery,
  TaxUpsertRequest
} from '../models/tax.model';

interface ApiEnvelope<T> {
  success?: boolean;
  status?: number;
  code?: string;
  message?: string;
  data: T;
}

type TaxListResponse =
  | TaxPagedResult
  | ApiEnvelope<TaxPagedResult>;

type TaxDetailResponse =
  | Tax
  | ApiEnvelope<Tax>;

@Injectable({
  providedIn: 'root'
})
export class TaxesApiService {

  private readonly http =
    inject(HttpClient);

  private readonly baseUrl =
    '/api/v1/taxes';

  getAll(
    query: TaxQuery = {}
  ): Observable<TaxPagedResult> {

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
      query.type
    ) {
      params =
        params.set(
          'type',
          query.type
        );
    }

    if (
      query.appliesTo
    ) {
      params =
        params.set(
          'appliesTo',
          query.appliesTo
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
      .get<TaxListResponse>(
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
  ): Observable<Tax> {

    return this.http
      .get<TaxDetailResponse>(
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
    request: TaxUpsertRequest
  ): Observable<Tax> {

    return this.http
      .post<TaxDetailResponse>(
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
    request: TaxUpsertRequest
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
      TaxActiveRequest =
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
