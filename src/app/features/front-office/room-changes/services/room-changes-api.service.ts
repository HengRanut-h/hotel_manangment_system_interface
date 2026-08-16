import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

import {
  Injectable,
  inject
} from '@angular/core';

import {
  Observable
} from 'rxjs';

import {
  RoomChange,
  RoomChangePagedResult,
  RoomChangeQuery
} from '../models/room-change.model';

@Injectable({
  providedIn: 'root'
})
export class RoomChangesApiService {

  private readonly http =
    inject(HttpClient);

  private readonly baseUrl =
    '/api/v1/room-changes';

  getAll(
    query: RoomChangeQuery = {}
  ): Observable<RoomChangePagedResult> {

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

    return this.http.get<RoomChangePagedResult>(
      this.baseUrl,
      {
        params
      }
    );
  }

  getById(
    id: string
  ): Observable<RoomChange> {

    return this.http.get<RoomChange>(
      `${this.baseUrl}/${id}`
    );
  }
}
