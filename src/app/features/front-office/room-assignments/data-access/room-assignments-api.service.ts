import {
  inject,
  Injectable
} from '@angular/core';

import {
  map,
  Observable
} from 'rxjs';

import {
  ApiClientService
} from '../../../../core/http/api-client.service';

import {
  ApiResponse,
  ChangeRoomAssignmentStatusRequest,
  CreateRoomAssignmentRequest,
  PagedResult,
  ReservationLookup,
  RoomAssignment,
  RoomAssignmentQuery,
  UpdateRoomAssignmentRequest
} from '../models/room-assignment.model';

@Injectable({
  providedIn: 'root'
})
export class RoomAssignmentsApiService {

  private readonly api =
    inject(ApiClientService);

  getPage(
    query: RoomAssignmentQuery = {}
  ): Observable<PagedResult<RoomAssignment>> {

    const params:
      Record<string, string | number> = {
        sortBy:
          query.sortBy ?? 'createdAt',
        sortDirection:
          query.sortDirection ?? 'desc',
        pageNumber:
          query.pageNumber ?? 1,
        pageSize:
          query.pageSize ?? 20
      };

    const search =
      query.search?.trim();
    const status =
      query.status?.trim();
    const relatedEntityType =
      query.relatedEntityType?.trim();
    const from =
      query.from?.trim();
    const to =
      query.to?.trim();

    if (search) {
      params['search'] = search;
    }

    if (status) {
      params['status'] = status;
    }

    if (relatedEntityType) {
      params['relatedEntityType'] =
        relatedEntityType;
    }

    if (from) {
      params['from'] = from;
    }

    if (to) {
      params['to'] = to;
    }

    return this.api
      .get<
        ApiResponse<unknown>
        |
        unknown
      >(
        'room-assignments',
        params
      )
      .pipe(
        map(
          response =>
            this.normalizePagedAssignments(
              this.unwrap(response),
              query.pageNumber ?? 1,
              query.pageSize ?? 20
            )
        )
      );
  }

  getById(
    id: string
  ): Observable<RoomAssignment> {

    return this.api
      .get<
        ApiResponse<RoomAssignment>
        |
        RoomAssignment
      >(
        `room-assignments/${id}`
      )
      .pipe(
        map(
          response =>
            this.unwrap(response)
        )
      );
  }

  create(
    request: CreateRoomAssignmentRequest
  ): Observable<unknown> {

    return this.api
      .post<unknown>(
        'room-assignments',
        request
      );
  }

  update(
    id: string,
    request: UpdateRoomAssignmentRequest
  ): Observable<unknown> {

    return this.api
      .put<unknown>(
        `room-assignments/${id}`,
        request
      );
  }

  changeStatus(
    id: string,
    request: ChangeRoomAssignmentStatusRequest
  ): Observable<unknown> {

    return this.api
      .patch<unknown>(
        `room-assignments/${id}/status`,
        request
      );
  }

  delete(
    id: string
  ): Observable<void> {

    return this.api
      .delete<void>(
        `room-assignments/${id}`
      );
  }

  getReservations():
    Observable<ReservationLookup[]> {

    /*
     * Reservation is the verified related entity in the room-assignment seed.
     * No raw GUID field is exposed to staff in the UI.
     */
    return this.api
      .get<
        ApiResponse<unknown>
        |
        unknown
      >(
        'reservations'
      )
      .pipe(
        map(
          response =>
            this.normalizeReservations(
              this.unwrap(response)
            )
        )
      );
  }

  private unwrap<T>(
    response: ApiResponse<T> | T
  ): T {

    if (
      response !== null
      &&
      typeof response === 'object'
      &&
      'data' in response
    ) {
      return (
        response as ApiResponse<T>
      ).data;
    }

    return response as T;
  }

  private normalizePagedAssignments(
    payload: unknown,
    requestedPage: number,
    requestedPageSize: number
  ): PagedResult<RoomAssignment> {

    if (Array.isArray(payload)) {
      return {
        items: payload as RoomAssignment[],
        pageNumber: requestedPage,
        pageSize: requestedPageSize,
        totalItems: payload.length,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false
      };
    }

    if (
      payload === null
      ||
      typeof payload !== 'object'
    ) {
      return {
        items: [],
        pageNumber: requestedPage,
        pageSize: requestedPageSize,
        totalItems: 0,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false
      };
    }

    const record =
      payload as Record<string, unknown>;

    const items =
      Array.isArray(record['items'])
        ? record['items'] as RoomAssignment[]
        : Array.isArray(record['Items'])
          ? record['Items'] as RoomAssignment[]
          : [];

    const pageNumber =
      this.numberValue(
        record['pageNumber']
        ??
        record['PageNumber'],
        requestedPage
      );

    const pageSize =
      this.numberValue(
        record['pageSize']
        ??
        record['PageSize'],
        requestedPageSize
      );

    const totalItems =
      this.numberValue(
        record['totalItems']
        ??
        record['TotalItems']
        ??
        record['totalRecords']
        ??
        record['TotalRecords'],
        items.length
      );

    const totalPages =
      this.numberValue(
        record['totalPages']
        ??
        record['TotalPages'],
        Math.max(
          1,
          Math.ceil(
            totalItems /
            Math.max(pageSize, 1)
          )
        )
      );

    return {
      items,
      pageNumber,
      pageSize,
      totalItems,
      totalPages,
      hasPreviousPage:
        pageNumber > 1,
      hasNextPage:
        pageNumber < totalPages
    };
  }

  private normalizeReservations(
    payload: unknown
  ): ReservationLookup[] {

    const values =
      Array.isArray(payload)
        ? payload
        : (
            payload !== null
            &&
            typeof payload === 'object'
          )
          ? (
              Array.isArray(
                (payload as Record<string, unknown>)['items']
              )
                ? (
                    payload as Record<string, unknown>
                  )['items'] as unknown[]
                : Array.isArray(
                    (payload as Record<string, unknown>)['Items']
                  )
                  ? (
                      payload as Record<string, unknown>
                    )['Items'] as unknown[]
                  : []
            )
          : [];

    return values
      .map(
        value =>
          this.toReservation(value)
      )
      .filter(
        (
          value
        ): value is ReservationLookup =>
          value !== null
      );
  }

  private toReservation(
    value: unknown
  ): ReservationLookup | null {

    if (
      value === null
      ||
      typeof value !== 'object'
    ) {
      return null;
    }

    const row =
      value as Record<string, unknown>;

    const id =
      this.stringValue(
        row['id']
        ??
        row['Id']
      );

    if (!id) {
      return null;
    }

    return {
      id,
      reservationNumber:
        this.stringValue(
          row['reservationNumber']
          ??
          row['ReservationNumber']
        ),
      guestName:
        this.stringValue(
          row['guestName']
          ??
          row['GuestName']
        ),
      roomNumber:
        this.nullableString(
          row['roomNumber']
          ??
          row['RoomNumber']
        ),
      roomTypeName:
        this.stringValue(
          row['roomTypeName']
          ??
          row['RoomTypeName']
        ),
      checkInDate:
        this.stringValue(
          row['checkInDate']
          ??
          row['CheckInDate']
        ),
      checkOutDate:
        this.stringValue(
          row['checkOutDate']
          ??
          row['CheckOutDate']
        ),
      status:
        this.stringValue(
          row['status']
          ??
          row['Status']
        )
    };
  }

  private stringValue(
    value: unknown
  ): string {
    if (
      value === null
      ||
      value === undefined
    ) {
      return '';
    }

    return String(value);
  }

  private nullableString(
    value: unknown
  ): string | null {
    const normalized =
      this.stringValue(value).trim();

    return normalized
      ? normalized
      : null;
  }

  private numberValue(
    value: unknown,
    fallback: number
  ): number {
    const parsed =
      Number(value);

    return Number.isFinite(parsed)
      ? parsed
      : fallback;
  }
}
