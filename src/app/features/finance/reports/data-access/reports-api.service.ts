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
  OccupancyReport,
  OccupancyReportQuery,
  RevenueReport,
  RevenueReportQuery
} from '../models/report.model';

interface ApiResponse<T> {
  success?: boolean;
  status?: number;
  code?: string;
  message?: string;
  data: T;
  traceId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportsApiService {

  private readonly http =
    inject(HttpClient);

  private readonly baseUrl =
    '/api/v1/reports';

  getRevenue(
    query: RevenueReportQuery
  ): Observable<RevenueReport> {

    const params =
      new HttpParams()
        .set(
          'from',
          query.from
        )
        .set(
          'to',
          query.to
        );

    return this.http
      .get<
        RevenueReport |
        ApiResponse<RevenueReport>
      >(
        `${this.baseUrl}/revenue`,
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

  getOccupancy(
    query: OccupancyReportQuery
  ): Observable<OccupancyReport> {

    const params =
      new HttpParams()
        .set(
          'date',
          query.date
        );

    return this.http
      .get<
        OccupancyReport |
        ApiResponse<OccupancyReport>
      >(
        `${this.baseUrl}/occupancy`,
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
      T | ApiResponse<T>
  ): T {

    if (
      response &&
      typeof response === 'object' &&
      'data' in response
    ) {
      return (
        response as ApiResponse<T>
      ).data;
    }

    return response as T;
  }
}
