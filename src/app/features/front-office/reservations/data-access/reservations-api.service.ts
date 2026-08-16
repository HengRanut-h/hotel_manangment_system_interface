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
  CreateReservationRequest,
  Reservation,
  ReservationListPayload
} from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationsApiService {

  private readonly api =
    inject(ApiClientService);

  getAll():
    Observable<ReservationListPayload> {

    /*
     * The Reservations GET action is verified.
     * The exact server-side Reservation list-query DTO was not
     * available in the retrieved source, so this method does not
     * invent page/search/status query parameters.
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
            this.normalizeList(
              this.unwrap(response)
            )
        )
      );
  }

  getById(
    id: string
  ): Observable<Reservation> {

    return this.api
      .get<
        ApiResponse<unknown>
        |
        unknown
      >(
        `reservations/${id}`
      )
      .pipe(
        map(
          response =>
            this.requireReservation(
              this.unwrap(response)
            )
        )
      );
  }

  create(
    request: CreateReservationRequest
  ): Observable<Reservation> {

    /*
     * IMPORTANT CONTRACT NOTE
     * -----------------------
     * POST /api/v1/reservations is verified, but the exact source
     * body of ReservationRequest.cs was unavailable.
     *
     * This request intentionally sends the smallest booking shape
     * supported by the verified reservation storage model.
     *
     * If ReservationRequest.cs differs, adjust only this request
     * model/mapping instead of changing the backend to fit the UI.
     */
    return this.api
      .post<
        ApiResponse<unknown>
        |
        unknown
      >(
        'reservations',
        request
      )
      .pipe(
        map(
          response =>
            this.requireReservation(
              this.unwrap(response)
            )
        )
      );
  }

  cancel(
    id: string
  ): Observable<Reservation | null> {

    return this.workflow(
      `${id}/cancel`
    );
  }

  checkIn(
    id: string
  ): Observable<Reservation | null> {

    return this.workflow(
      `${id}/check-in`
    );
  }

  checkOut(
    id: string
  ): Observable<Reservation | null> {

    return this.workflow(
      `${id}/check-out`
    );
  }

  private workflow(
    suffix: string
  ): Observable<Reservation | null> {

    /*
     * Endpoint inventory verifies POST workflow actions.
     * No workflow request-body contract was visible, therefore an
     * empty object is sent. If your controller expects a specific
     * workflow body, align these three methods with that DTO.
     */
    return this.api
      .post<
        ApiResponse<unknown>
        |
        unknown
      >(
        `reservations/${suffix}`,
        {}
      )
      .pipe(
        map(
          response => {

            const data =
              this.unwrap(response);

            return this.toReservation(
              data
            );
          }
        )
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

  private normalizeList(
    payload: unknown
  ): ReservationListPayload {

    if (
      Array.isArray(payload)
    ) {
      return {
        items:
          this.mapReservations(
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

    const candidate =
      record['items']
      ??
      record['Items']
      ??
      record['reservations']
      ??
      record['Reservations'];

    if (
      !Array.isArray(candidate)
    ) {
      const single =
        this.toReservation(
          payload
        );

      return {
        items:
          single
            ? [single]
            : []
      };
    }

    return {
      items:
        this.mapReservations(
          candidate
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

      totalPages:
        this.optionalNumber(
          record['totalPages']
          ??
          record['TotalPages']
        )
    };
  }

  private mapReservations(
    values: unknown[]
  ): Reservation[] {

    return values
      .map(
        value =>
          this.toReservation(value)
      )
      .filter(
        (
          item
        ): item is Reservation =>
          item !== null
      );
  }

  private requireReservation(
    payload: unknown
  ): Reservation {

    const item =
      this.toReservation(
        payload
      );

    if (!item) {
      throw new Error(
        'Reservation response could not be normalized.'
      );
    }

    return item;
  }

  private toReservation(
    value: unknown
  ): Reservation | null {

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

    const nightsFromApi =
      this.optionalNumber(
        row['nights']
        ??
        row['Nights']
      );

    return {
      id,

      hotelId:
        this.stringValue(
          row['hotelId']
          ??
          row['HotelId']
        ),

      branchId:
        this.nullableString(
          row['branchId']
          ??
          row['BranchId']
        ),

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
        nightsFromApi
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

    const normalized =
      Number(value);

    return Number.isFinite(
      normalized
    )
      ? normalized
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

    const normalized =
      Number(value);

    return Number.isFinite(
      normalized
    )
      ? normalized
      : undefined;
  }
}
