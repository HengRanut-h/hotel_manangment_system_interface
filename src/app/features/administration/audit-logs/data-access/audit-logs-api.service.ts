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
  AuditLog,
  AuditLogPagedResult,
  AuditLogQuery
} from '../models/audit-log.model';

interface ApiEnvelope<T> {
  success?: boolean;
  status?: number;
  code?: string;
  message?: string;
  data: T;
}

type ListResponse =
  | AuditLogPagedResult
  | ApiEnvelope<AuditLogPagedResult>;

@Injectable({
  providedIn: 'root'
})
export class AuditLogsApiService {

  private readonly http =
    inject(HttpClient);

  private readonly baseUrl =
    '/api/v1/audit-logs';

  getAll(
    query: AuditLogQuery = {}
  ): Observable<AuditLogPagedResult> {

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
      query.action
    ) {
      params =
        params.set(
          'action',
          query.action
        );
    }

    if (
      query.entityName
    ) {
      params =
        params.set(
          'entityName',
          query.entityName
        );
    }

    if (
      query.module
    ) {
      params =
        params.set(
          'module',
          query.module
        );
    }

    if (
      query.userId
    ) {
      params =
        params.set(
          'userId',
          query.userId
        );
    }

    if (
      query.fromUtc
    ) {
      params =
        params.set(
          'fromUtc',
          query.fromUtc
        );
    }

    if (
      query.toUtc
    ) {
      params =
        params.set(
          'toUtc',
          query.toUtc
        );
    }

    if (
      query.succeeded !== undefined
    ) {
      params =
        params.set(
          'succeeded',
          query.succeeded
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
