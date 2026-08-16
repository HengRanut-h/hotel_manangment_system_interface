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
  Deposit,
  DepositPagedResult,
  DepositQuery
} from '../models/deposit.model';

interface ApiEnvelope<T> {
  success?: boolean;
  status?: number;
  code?: string;
  message?: string;
  data: T;
}

type DepositListResponse =
  | DepositPagedResult
  | ApiEnvelope<DepositPagedResult>;

type DepositDetailResponse =
  | Deposit
  | ApiEnvelope<Deposit>;

@Injectable({
  providedIn: 'root'
})
export class DepositsApiService {

  private readonly http =
    inject(HttpClient);

  private readonly baseUrl =
    '/api/v1/deposits';

  getAll(
    query: DepositQuery = {}
  ): Observable<DepositPagedResult> {

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
      query.status
    ) {
      params =
        params.set(
          'status',
          query.status
        );
    }

    if (
      query.depositType
    ) {
      params =
        params.set(
          'depositType',
          query.depositType
        );
    }

    if (
      query.paymentMethod
    ) {
      params =
        params.set(
          'paymentMethod',
          query.paymentMethod
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
      .get<DepositListResponse>(
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
  ): Observable<Deposit> {

    return this.http
      .get<DepositDetailResponse>(
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
