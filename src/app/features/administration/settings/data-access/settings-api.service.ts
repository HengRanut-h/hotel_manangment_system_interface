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
  SettingActiveRequest,
  SettingItem,
  SettingPagedResult,
  SettingQuery,
  SettingUpsertRequest
} from '../models/setting.model';

interface ApiEnvelope<T> {
  success?: boolean;
  status?: number;
  code?: string;
  message?: string;
  data: T;
}

type ListResponse =
  | SettingPagedResult
  | ApiEnvelope<SettingPagedResult>;

type DetailResponse =
  | SettingItem
  | ApiEnvelope<SettingItem>;

@Injectable({
  providedIn: 'root'
})
export class SettingsApiService {

  private readonly http =
    inject(HttpClient);

  private readonly baseUrl =
    '/api/v1/settings';

  getAll(
    query: SettingQuery = {}
  ): Observable<SettingPagedResult> {

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
      query.category
    ) {
      params =
        params.set(
          'category',
          query.category
        );
    }

    if (
      query.valueType
    ) {
      params =
        params.set(
          'valueType',
          query.valueType
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
      query.includeDeleted !== undefined
    ) {
      params =
        params.set(
          'includeDeleted',
          query.includeDeleted
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
  ): Observable<SettingItem> {

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
    request: SettingUpsertRequest
  ): Observable<SettingItem> {

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
    request: SettingUpsertRequest
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

    const request:
      SettingActiveRequest =
    {
      isActive
    };

    return this.http.patch(
      `${this.baseUrl}/${id}/active`,
      request
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

  resetToDefault(
    id: string
  ): Observable<unknown> {

    return this.http.post(
      `${this.baseUrl}/${id}/reset`,
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
