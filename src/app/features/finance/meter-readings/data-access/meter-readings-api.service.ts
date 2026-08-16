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
  MeterReading,
  MeterReadingPagedResult,
  MeterReadingQuery,
  MeterReadingUpsertRequest
} from '../models/meter-reading.model';

interface ApiEnvelope<T> {
  success?: boolean;
  status?: number;
  code?: string;
  message?: string;
  data: T;
}

type ListResponse =
  | MeterReadingPagedResult
  | ApiEnvelope<MeterReadingPagedResult>;

type DetailResponse =
  | MeterReading
  | ApiEnvelope<MeterReading>;

@Injectable({
  providedIn: 'root'
})
export class MeterReadingsApiService {

  private readonly http =
    inject(HttpClient);

  private readonly baseUrl =
    '/api/v1/meter-readings';

  getAll(
    query: MeterReadingQuery = {}
  ): Observable<MeterReadingPagedResult> {

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

    if (query.meterId) {
      params = params.set(
        'meterId',
        query.meterId
      );
    }

    if (query.utilityId) {
      params = params.set(
        'utilityId',
        query.utilityId
      );
    }

    if (query.utilityType) {
      params = params.set(
        'utilityType',
        query.utilityType
      );
    }

    if (query.roomId) {
      params = params.set(
        'roomId',
        query.roomId
      );
    }

    if (query.fromUtc) {
      params = params.set(
        'fromUtc',
        query.fromUtc
      );
    }

    if (query.toUtc) {
      params = params.set(
        'toUtc',
        query.toUtc
      );
    }

    if (query.sortBy) {
      params = params.set(
        'sortBy',
        query.sortBy
      );
    }

    if (query.sortDirection) {
      params = params.set(
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
  ): Observable<MeterReading> {

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
    request: MeterReadingUpsertRequest
  ): Observable<MeterReading> {

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
    request: MeterReadingUpsertRequest
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

  restore(
    id: string
  ): Observable<unknown> {

    return this.http.post(
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
      typeof response === 'object' &&
      'data' in response
    ) {
      return (
        response as ApiEnvelope<T>
      ).data;
    }

    return response as T;
  }
}
