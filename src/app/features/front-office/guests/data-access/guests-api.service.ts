import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ApiClientService } from '../../../../core/http/api-client.service';

import {
  ApiResponse,
  Guest,
  GuestListPayload,
  GuestRequest
} from '../models/guest.model';

@Injectable({
  providedIn: 'root'
})
export class GuestsApiService {
  private readonly api = inject(ApiClientService);

  getAll(): Observable<GuestListPayload> {
    return this.api
      .get<ApiResponse<unknown> | unknown>('guests')
      .pipe(
        map(response =>
          this.normalizeList(
            this.unwrap(response)
          )
        )
      );
  }

  getById(id: string): Observable<Guest> {
    return this.api
      .get<ApiResponse<unknown> | unknown>(
        `guests/${id}`
      )
      .pipe(
        map(response =>
          this.requireGuest(
            this.unwrap(response)
          )
        )
      );
  }

  create(request: GuestRequest): Observable<Guest> {
    return this.api
      .post<ApiResponse<unknown> | unknown>(
        'guests',
        request
      )
      .pipe(
        map(response =>
          this.requireGuest(
            this.unwrap(response)
          )
        )
      );
  }

  update(
    id: string,
    request: GuestRequest
  ): Observable<Guest> {
    return this.api
      .put<ApiResponse<unknown> | unknown>(
        `guests/${id}`,
        request
      )
      .pipe(
        map(response =>
          this.requireGuest(
            this.unwrap(response)
          )
        )
      );
  }

  private unwrap(
    response: ApiResponse<unknown> | unknown
  ): unknown {
    if (
      response !== null &&
      typeof response === 'object' &&
      'data' in response
    ) {
      return (response as ApiResponse<unknown>).data;
    }

    return response;
  }

  private normalizeList(
    payload: unknown
  ): GuestListPayload {
    if (Array.isArray(payload)) {
      return {
        items: this.mapGuests(payload)
      };
    }

    if (
      payload === null ||
      typeof payload !== 'object'
    ) {
      return { items: [] };
    }

    const record =
      payload as Record<string, unknown>;

    const candidate =
      record['items'] ??
      record['Items'] ??
      record['guests'] ??
      record['Guests'];

    if (!Array.isArray(candidate)) {
      const single = this.toGuest(payload);

      return {
        items: single ? [single] : []
      };
    }

    return {
      items: this.mapGuests(candidate),
      pageNumber: this.optionalNumber(
        record['pageNumber'] ??
        record['PageNumber']
      ),
      pageSize: this.optionalNumber(
        record['pageSize'] ??
        record['PageSize']
      ),
      totalItems: this.optionalNumber(
        record['totalItems'] ??
        record['TotalItems'] ??
        record['totalRecords'] ??
        record['TotalRecords']
      ),
      totalPages: this.optionalNumber(
        record['totalPages'] ??
        record['TotalPages']
      )
    };
  }

  private mapGuests(values: unknown[]): Guest[] {
    return values
      .map(value => this.toGuest(value))
      .filter(
        (item): item is Guest =>
          item !== null
      );
  }

  private requireGuest(payload: unknown): Guest {
    const guest = this.toGuest(payload);

    if (!guest) {
      throw new Error(
        'Guest response could not be normalized.'
      );
    }

    return guest;
  }

  private toGuest(
    value: unknown
  ): Guest | null {
    if (
      value === null ||
      typeof value !== 'object'
    ) {
      return null;
    }

    const row =
      value as Record<string, unknown>;

    const id = this.stringValue(
      row['id'] ?? row['Id']
    );

    if (!id) {
      return null;
    }

    const firstName = this.stringValue(
      row['firstName'] ?? row['FirstName']
    );

    const lastName = this.stringValue(
      row['lastName'] ?? row['LastName']
    );

    const fullName =
      this.stringValue(
        row['fullName'] ?? row['FullName']
      ) ||
      `${firstName} ${lastName}`.trim();

    return {
      id,
      hotelId: this.stringValue(
        row['hotelId'] ?? row['HotelId']
      ),
      userId: this.nullableString(
        row['userId'] ?? row['UserId']
      ),
      firstName,
      lastName,
      fullName: fullName || id,
      phone: this.nullableString(
        row['phone'] ?? row['Phone']
      ),
      email: this.nullableString(
        row['email'] ?? row['Email']
      ),
      isVip: this.booleanValue(
        row['isVip'] ?? row['IsVip']
      ),
      createdAtUtc: this.stringValue(
        row['createdAtUtc'] ??
        row['CreatedAtUtc']
      )
    };
  }

  private stringValue(value: unknown): string {
    if (
      value === null ||
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

  private booleanValue(value: unknown): boolean {
    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'number') {
      return value !== 0;
    }

    const normalized =
      String(value ?? '')
        .trim()
        .toLowerCase();

    return (
      normalized === 'true' ||
      normalized === '1' ||
      normalized === 'yes'
    );
  }

  private optionalNumber(
    value: unknown
  ): number | undefined {
    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {
      return undefined;
    }

    const parsed = Number(value);

    return Number.isFinite(parsed)
      ? parsed
      : undefined;
  }
}
