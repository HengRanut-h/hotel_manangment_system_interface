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
  MeterReadingQuery,
  MeterReadingRequest
} from '../models/meter-reading.model';

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
export class MeterReadingsApiService {

  private readonly http =
    inject(HttpClient);

  private readonly baseUrl =
    '/api/v1/meter-readings';

  getAll(
    query: MeterReadingQuery = {}
  ): Observable<PagedResult<MeterReading>> {

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

    return this.http
      .get<
        PagedResult<MeterReading> |
        ApiEnvelope<PagedResult<MeterReading>>
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
  ): Observable<MeterReading> {

    return this.http
      .get<
        MeterReading |
        ApiEnvelope<MeterReading>
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
    request: MeterReadingRequest
  ): Observable<MeterReading> {

    return this.http
      .post<
        MeterReading |
        ApiEnvelope<MeterReading>
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
    request: MeterReadingRequest
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
}
