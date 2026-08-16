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
  ReportDefinition,
  ReportDefinitionPagedResult,
  ReportDefinitionQuery,
  ReportRun,
  ReportRunPagedResult,
  ReportRunQuery,
  RunReportRequest
} from '../models/report.model';

interface ApiEnvelope<T> {
  success?: boolean;
  status?: number;
  code?: string;
  message?: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class ReportsApiService {

  private readonly http =
    inject(HttpClient);

  private readonly baseUrl =
    '/api/v1/reports';

  getDefinitions(
    query:
      ReportDefinitionQuery = {}
  ):
    Observable<ReportDefinitionPagedResult> {

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
      .get<
        ReportDefinitionPagedResult |
        ApiEnvelope<ReportDefinitionPagedResult>
      >(
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

  getDefinitionById(
    id: string
  ): Observable<ReportDefinition> {

    return this.http
      .get<
        ReportDefinition |
        ApiEnvelope<ReportDefinition>
      >(
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

  run(
    request:
      RunReportRequest
  ): Observable<ReportRun> {

    return this.http
      .post<
        ReportRun |
        ApiEnvelope<ReportRun>
      >(
        `${this.baseUrl}/${request.reportId}/run`,
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

  getRuns(
    query:
      ReportRunQuery = {}
  ):
    Observable<ReportRunPagedResult> {

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
      query.reportId
    ) {
      params =
        params.set(
          'reportId',
          query.reportId
        );
    }

    if (
      query.status
    ) {
      params =
        params.set(
          'status',
          query.status
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
      query.sortDirection
    ) {
      params =
        params.set(
          'sortDirection',
          query.sortDirection
        );
    }

    return this.http
      .get<
        ReportRunPagedResult |
        ApiEnvelope<ReportRunPagedResult>
      >(
        `${this.baseUrl}/runs`,
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

  getRunById(
    runId: string
  ): Observable<ReportRun> {

    return this.http
      .get<
        ReportRun |
        ApiEnvelope<ReportRun>
      >(
        `${this.baseUrl}/runs/${runId}`
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

  cancelRun(
    runId: string
  ): Observable<unknown> {

    return this.http.post(
      `${this.baseUrl}/runs/${runId}/cancel`,
      {}
    );
  }

  deleteRun(
    runId: string
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.baseUrl}/runs/${runId}`
    );
  }

  downloadRun(
    runId: string
  ): Observable<Blob> {

    return this.http.get(
      `${this.baseUrl}/runs/${runId}/download`,
      {
        responseType:
          'blob'
      }
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
