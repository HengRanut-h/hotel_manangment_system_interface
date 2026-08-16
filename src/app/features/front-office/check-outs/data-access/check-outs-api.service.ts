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
  CheckOutReservation,
  CheckOutReservationList
} from '../models/check-out.model';

@Injectable({
  providedIn: 'root'
})
export class CheckOutsApiService {

  private readonly api =
    inject(ApiClientService);

  getReservations():
    Observable<CheckOutReservationList> {

    /*
     * The backend does not expose GET /check-outs.
     * This workspace therefore reads reservation records from the
     * verified GET /api/v1/reservations endpoint.
     *
     * The exact Reservation list-query DTO was not available in
     * the retrieved project material, so no unverified query
     * parameters are invented here.
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
            this.normalizeReservationList(
              this.unwrap(response)
            )
        )
      );
  }

  checkOut(
    reservationId: string
  ): Observable<unknown> {

    /*
     * Verified backend endpoint:
     * POST /api/v1/check-outs/{reservationId}
     *
     * The endpoint inventory shows reservationId in the route.
     * No request-body DTO was verified, so an empty object is sent
     * only to satisfy the frontend ApiClientService POST signature.
     */
    return this.api.post<
      ApiResponse<unknown>
      |
      unknown
    >(
      `check-outs/${reservationId}`,
      {}
    );
  }

  private unwrap(
    response:
      ApiResponse<unknown>
      |
      unknown
  ): unknown {

    if (
      response !== null
      &&
      typeof response === 'object'
      &&
      'data' in response
    ) {
      return (
        response as ApiResponse<unknown>
      ).data;
    }

    return response;
  }

  private normalizeReservationList(
    payload: unknown
  ): CheckOutReservationList {

    if (
      Array.isArray(payload)
    ) {
      return {
        items:
          this.normalizeReservations(
            payload
          )
      };
    }

    if (
      payload === null
      ||
      typeof payload !== 'object'
    ) {
      return {
        items: []
      };
    }

    const record =
      payload as Record<string, unknown>;

    const items =
      record['items']
      ??
      record['Items']
      ??
      record['reservations']
      ??
      record['Reservations'];

    if (
      !Array.isArray(items)
    ) {
      return {
        items: []
      };
    }

    return {
      items:
        this.normalizeReservations(
          items
        ),

      totalItems:
        this.optionalNumber(
          record['totalItems']
          ??
          record['TotalItems']
          ??
          record['totalRecords']
          ??
          record['TotalRecords']
        ),

      pageNumber:
        this.optionalNumber(
          record['pageNumber']
          ??
          record['PageNumber']
        ),

      pageSize:
        this.optionalNumber(
          record['pageSize']
          ??
          record['PageSize']
        ),

      totalPages:
        this.optionalNumber(
          record['totalPages']
          ??
          record['TotalPages']
        )
    };
  }

  private normalizeReservations(
    values: unknown[]
  ): CheckOutReservation[] {

    return values
      .map(
        value =>
          this.toReservation(
            value
          )
      )
      .filter(
        (
          item
        ): item is CheckOutReservation =>
          item !== null
      );
  }

  private toReservation(
    value: unknown
  ): CheckOutReservation | null {

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

    const checkInDate =
      this.stringValue(
        row['checkInDate']
        ??
        row['CheckInDate']
      );

    const checkOutDate =
      this.stringValue(
        row['checkOutDate']
        ??
        row['CheckOutDate']
      );

    return {
      id,

      reservationNumber:
        this.stringValue(
          row['reservationNumber']
          ??
          row['ReservationNumber']
        ),

      guestId:
        this.stringValue(
          row['guestId']
          ??
          row['GuestId']
        ),

      guestName:
        this.stringValue(
          row['guestName']
          ??
          row['GuestName']
        ),

      roomTypeId:
        this.stringValue(
          row['roomTypeId']
          ??
          row['RoomTypeId']
        ),

      roomTypeName:
        this.stringValue(
          row['roomTypeName']
          ??
          row['RoomTypeName']
        ),

      roomId:
        this.nullableString(
          row['roomId']
          ??
          row['RoomId']
        ),

      roomNumber:
        this.nullableString(
          row['roomNumber']
          ??
          row['RoomNumber']
        ),

      checkInDate,
      checkOutDate,

      adults:
        this.numberValue(
          row['adults']
          ??
          row['Adults']
        ),

      children:
        this.numberValue(
          row['children']
          ??
          row['Children']
        ),

      nightlyRate:
        this.numberValue(
          row['nightlyRate']
          ??
          row['NightlyRate']
        ),

      totalAmount:
        this.numberValue(
          row['totalAmount']
          ??
          row['TotalAmount']
        ),

      nights:
        this.optionalNumber(
          row['nights']
          ??
          row['Nights']
        )
        ??
        this.calculateNights(
          checkInDate,
          checkOutDate
        ),

      status:
        this.stringValue(
          row['status']
          ??
          row['Status']
        ),

      createdAtUtc:
        this.stringValue(
          row['createdAtUtc']
          ??
          row['CreatedAtUtc']
        )
    };
  }

  private calculateNights(
    checkInDate: string,
    checkOutDate: string
  ): number {

    const start =
      new Date(
        `${checkInDate}T00:00:00`
      );

    const end =
      new Date(
        `${checkOutDate}T00:00:00`
      );

    const difference =
      end.getTime()
      -
      start.getTime();

    if (
      !Number.isFinite(difference)
      ||
      difference <= 0
    ) {
      return 0;
    }

    return Math.round(
      difference
      /
      86_400_000
    );
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
      this.stringValue(
        value
      )
        .trim();

    return normalized
      ? normalized
      : null;
  }

  private numberValue(
    value: unknown
  ): number {

    const parsed =
      Number(value);

    return Number.isFinite(parsed)
      ? parsed
      : 0;
  }

  private optionalNumber(
    value: unknown
  ): number | undefined {

    if (
      value === null
      ||
      value === undefined
      ||
      value === ''
    ) {
      return undefined;
    }

    const parsed =
      Number(value);

    return Number.isFinite(parsed)
      ? parsed
      : undefined;
  }
}
