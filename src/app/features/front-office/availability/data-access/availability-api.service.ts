import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ApiClientService } from '../../../../core/http/api-client.service';

import {
  ApiResponse,
  AvailabilityQuery,
  AvailabilityRoom
} from '../models/availability.model';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityApiService {
  private readonly api = inject(ApiClientService);

  search(query: AvailabilityQuery): Observable<AvailabilityRoom[]> {
    /*
     * GET /api/v1/availability is verified.
     * Verify these query-key names against AvailabilityRequest.cs.
     * Keeping them here makes any contract adjustment isolated.
     */
    const params: Record<string, string> = {
      checkInDate: query.checkInDate,
      checkOutDate: query.checkOutDate
    };

    return this.api
      .get<ApiResponse<unknown> | unknown>('availability', params)
      .pipe(
        map(response =>
          this.normalizeRooms(
            this.unwrap(response)
          )
        )
      );
  }

  private unwrap(response: ApiResponse<unknown> | unknown): unknown {
    if (
      response !== null &&
      typeof response === 'object' &&
      'data' in response
    ) {
      return (response as ApiResponse<unknown>).data;
    }

    return response;
  }

  private normalizeRooms(payload: unknown): AvailabilityRoom[] {
    if (Array.isArray(payload)) {
      return this.mapRooms(payload);
    }

    if (
      payload === null ||
      typeof payload !== 'object'
    ) {
      return [];
    }

    const record = payload as Record<string, unknown>;

    const candidate =
      record['rooms'] ??
      record['availableRooms'] ??
      record['items'] ??
      record['Rooms'] ??
      record['AvailableRooms'] ??
      record['Items'];

    return Array.isArray(candidate)
      ? this.mapRooms(candidate)
      : [];
  }

  private mapRooms(values: unknown[]): AvailabilityRoom[] {
    return values
      .map(value => this.mapRoom(value))
      .filter(
        (room): room is AvailabilityRoom =>
          room !== null
      );
  }

  private mapRoom(value: unknown): AvailabilityRoom | null {
    if (
      value === null ||
      typeof value !== 'object'
    ) {
      return null;
    }

    const row = value as Record<string, unknown>;

    const id = this.stringValue(row['id'] ?? row['Id']);
    const roomNumber =
      this.stringValue(row['roomNumber'] ?? row['RoomNumber']);
    const roomTypeId =
      this.stringValue(row['roomTypeId'] ?? row['RoomTypeId']);
    const roomTypeName =
      this.stringValue(row['roomTypeName'] ?? row['RoomTypeName']);
    const status =
      this.stringValue(row['status'] ?? row['Status']);
    const baseRate =
      this.numberValue(row['baseRate'] ?? row['BaseRate']);

    if (
      !id ||
      !roomNumber ||
      !roomTypeId ||
      !roomTypeName
    ) {
      return null;
    }

    return {
      id,
      roomNumber,
      roomTypeId,
      roomTypeName,
      baseRate,
      status
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

  private numberValue(value: unknown): number {
    const number = Number(value);

    return Number.isFinite(number)
      ? number
      : 0;
  }
}
