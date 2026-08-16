import {
  Injectable,
  inject
} from '@angular/core';

import {
  Observable,
  map
} from 'rxjs';

import {
  ApiClientService
} from '../../../../core/http/api-client.service';

import {
  AddFolioChargeRequest,
  ApiResponse,
  CreateFolioRequest,
  Folio,
  FolioCharge,
  ReservationLookup
} from '../models/folio.model';

@Injectable({
  providedIn: 'root'
})
export class FoliosApiService {

  private readonly api =
    inject(ApiClientService);


  // =========================================================
  // FOLIO
  // =========================================================

  getById(
    id: string
  ): Observable<Folio> {

    return this.api
      .get<
        ApiResponse<unknown>
        |
        unknown
      >(
        `folios/${id}`
      )
      .pipe(
        map(
          response =>
            this.normalizeFolio(
              this.unwrap(response)
            )
        )
      );
  }


  create(
    request: CreateFolioRequest
  ): Observable<Folio> {

    return this.api
      .post<
        ApiResponse<unknown>
        |
        unknown
      >(
        'folios',
        request
      )
      .pipe(
        map(
          response =>
            this.normalizeFolio(
              this.unwrap(response)
            )
        )
      );
  }


  addCharge(
    folioId: string,
    request: AddFolioChargeRequest
  ): Observable<void> {

    return this.api
      .post<
        ApiResponse<unknown>
        |
        unknown
      >(
        `folios/${folioId}/charges`,
        request
      )
      .pipe(
        map(
          () =>
            void 0
        )
      );
  }


  close(
    folioId: string
  ): Observable<void> {

    return this.api
      .post<
        ApiResponse<unknown>
        |
        unknown
      >(
        `folios/${folioId}/close`,
        {}
      )
      .pipe(
        map(
          () =>
            void 0
        )
      );
  }


  // =========================================================
  // RESERVATION LOOKUP
  // =========================================================

  getReservations():
    Observable<ReservationLookup[]> {

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


  // =========================================================
  // UNWRAP
  // =========================================================

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


  // =========================================================
  // FOLIO NORMALIZER
  // =========================================================

  private normalizeFolio(
    payload: unknown
  ): Folio {

    if (
      payload === null
      ||
      typeof payload !== 'object'
      ||
      Array.isArray(payload)
    ) {
      throw new Error(
        'Invalid folio response.'
      );
    }

    const row =
      payload as Record<string, unknown>;

    const id =
      this.stringValue(
        row['id']
        ??
        row['Id']
      );

    if (!id) {
      throw new Error(
        'Folio response is missing its id.'
      );
    }

    const chargesValue =
      row['charges']
      ??
      row['Charges']
      ??
      row['folioCharges']
      ??
      row['FolioCharges'];

    return {
      id,

      hotelId:
        this.nullableString(
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

      reservationId:
        this.stringValue(
          row['reservationId']
          ??
          row['ReservationId']
        ),

      guestId:
        this.stringValue(
          row['guestId']
          ??
          row['GuestId']
        ),

      folioNumber:
        this.stringValue(
          row['folioNumber']
          ??
          row['FolioNumber']
        ),

      isClosed:
        this.booleanValue(
          row['isClosed']
          ??
          row['IsClosed']
        ),

      createdAtUtc:
        this.nullableString(
          row['createdAtUtc']
          ??
          row['CreatedAtUtc']
        ),

      charges:
        this.normalizeCharges(
          chargesValue
        )
    };
  }


  private normalizeCharges(
    value: unknown
  ): FolioCharge[] {

    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map(
        item =>
          this.normalizeCharge(item)
      )
      .filter(
        (
          item
        ): item is FolioCharge =>
          item !== null
      );
  }


  private normalizeCharge(
    value: unknown
  ): FolioCharge | null {

    if (
      value === null
      ||
      typeof value !== 'object'
      ||
      Array.isArray(value)
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

      folioId:
        this.nullableString(
          row['folioId']
          ??
          row['FolioId']
        ),

      category:
        this.stringValue(
          row['category']
          ??
          row['Category']
        ),

      description:
        this.stringValue(
          row['description']
          ??
          row['Description']
        ),

      amount:
        this.numberValue(
          row['amount']
          ??
          row['Amount']
        ),

      isVoided:
        this.booleanValue(
          row['isVoided']
          ??
          row['IsVoided']
        ),

      createdAtUtc:
        this.nullableString(
          row['createdAtUtc']
          ??
          row['CreatedAtUtc']
        )
    };
  }


  // =========================================================
  // RESERVATION NORMALIZER
  // =========================================================

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
            &&
            !Array.isArray(payload)
          )
          ? this.extractArray(
              payload as Record<string, unknown>
            )
          : [];

    return values
      .map(
        value =>
          this.normalizeReservation(value)
      )
      .filter(
        (
          item
        ): item is ReservationLookup =>
          item !== null
      );
  }


  private extractArray(
    record: Record<string, unknown>
  ): unknown[] {

    const value =
      record['items']
      ??
      record['Items']
      ??
      record['reservations']
      ??
      record['Reservations'];

    return Array.isArray(value)
      ? value
      : [];
  }


  private normalizeReservation(
    value: unknown
  ): ReservationLookup | null {

    if (
      value === null
      ||
      typeof value !== 'object'
      ||
      Array.isArray(value)
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


  // =========================================================
  // VALUES
  // =========================================================

  private stringValue(
    value: unknown
  ): string {

    return typeof value === 'string'
      ? value
      : value === null
        || value === undefined
        ? ''
        : String(value);
  }


  private nullableString(
    value: unknown
  ): string | null {

    const result =
      this.stringValue(value)
        .trim();

    return result
      ? result
      : null;
  }


  private numberValue(
    value: unknown
  ): number {

    const result =
      Number(value);

    return Number.isFinite(result)
      ? result
      : 0;
  }


  private booleanValue(
    value: unknown
  ): boolean {

    if (
      value === true
      ||
      value === 1
      ||
      value === '1'
    ) {
      return true;
    }

    if (
      typeof value === 'string'
    ) {
      return (
        value
          .trim()
          .toLowerCase()
        === 'true'
      );
    }

    return false;
  }
}
