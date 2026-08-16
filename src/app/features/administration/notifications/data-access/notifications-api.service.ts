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
  NotificationItem,
  NotificationPagedResult,
  NotificationQuery,
  NotificationUnreadCount
} from '../models/notification.model';

interface ApiEnvelope<T> {
  success?: boolean;
  status?: number;
  code?: string;
  message?: string;
  data: T;
}

type ListResponse =
  | NotificationPagedResult
  | ApiEnvelope<NotificationPagedResult>;

type DetailResponse =
  | NotificationItem
  | ApiEnvelope<NotificationItem>;

type CountResponse =
  | NotificationUnreadCount
  | ApiEnvelope<NotificationUnreadCount>;

@Injectable({
  providedIn: 'root'
})
export class NotificationsApiService {

  private readonly http =
    inject(HttpClient);

  private readonly baseUrl =
    '/api/v1/notifications';

  getAll(
    query: NotificationQuery = {}
  ): Observable<NotificationPagedResult> {

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
      query.isRead !== undefined
    ) {
      params =
        params.set(
          'isRead',
          query.isRead
        );
    }

    if (
      query.isArchived !== undefined
    ) {
      params =
        params.set(
          'isArchived',
          query.isArchived
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
      query.priority
    ) {
      params =
        params.set(
          'priority',
          query.priority
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
  ): Observable<NotificationItem> {

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

  getUnreadCount():
    Observable<NotificationUnreadCount> {

    return this.http
      .get<CountResponse>(
        `${this.baseUrl}/unread-count`
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

  markRead(
    id: string
  ): Observable<unknown> {

    return this.http.patch(
      `${this.baseUrl}/${id}/read`,
      {}
    );
  }

  markUnread(
    id: string
  ): Observable<unknown> {

    return this.http.patch(
      `${this.baseUrl}/${id}/unread`,
      {}
    );
  }

  markAllRead():
    Observable<unknown> {

    return this.http.patch(
      `${this.baseUrl}/read-all`,
      {}
    );
  }

  archive(
    id: string
  ): Observable<unknown> {

    return this.http.patch(
      `${this.baseUrl}/${id}/archive`,
      {}
    );
  }

  unarchive(
    id: string
  ): Observable<unknown> {

    return this.http.patch(
      `${this.baseUrl}/${id}/unarchive`,
      {}
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
        response as
          ApiEnvelope<T>
      ).data;
    }

    return response as T;
  }
}
