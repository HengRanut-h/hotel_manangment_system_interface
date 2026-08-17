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
  AvailabilityQuery,
  AvailabilityRoom,
  AvailabilityRoomTypeOption
} from '../models/availability.model';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityApiService {

  // =========================================================
  // DEPENDENCIES
  // =========================================================

  private readonly api =
    inject(ApiClientService);


  // =========================================================
  // SEARCH AVAILABLE ROOMS
  //
  // GET /api/v1/availability
  // =========================================================

  search(
    query: AvailabilityQuery
  ): Observable<AvailabilityRoom[]> {

    const params:
      Record<string, string> = {

      checkIn:
        query.checkIn,

      checkOut:
        query.checkOut
    };


    if (
      query.roomTypeId
    ) {

      params['roomTypeId'] =
        query.roomTypeId;
    }


    return this.api
      .get<unknown>(
        'availability',
        params
      )
      .pipe(
        map(
          response =>
            this.normalizeRooms(
              response
            )
        )
      );
  }


  // =========================================================
  // GET ROOM TYPES
  //
  // Used only for select options.
  //
  // User sees:
  //
  // Deluxe Room
  //
  // Backend receives:
  //
  // roomTypeId=<guid>
  // =========================================================

  getRoomTypeOptions():
    Observable<AvailabilityRoomTypeOption[]> {

    return this.api
      .get<unknown>(
        'room-types',
        {
          pageNumber:
            '1',

          pageSize:
            '100'
        }
      )
      .pipe(
        map(
          response =>
            this.normalizeRoomTypes(
              response
            )
        )
      );
  }


  // =========================================================
  // NORMALIZE AVAILABILITY ROOMS
  // =========================================================

  private normalizeRooms(
    response: unknown
  ): AvailabilityRoom[] {

    const payload =
      this.unwrapData(
        response
      );


    if (
      Array.isArray(
        payload
      )
    ) {

      return this.mapRooms(
        payload
      );
    }


    if (
      payload === null
      ||
      typeof payload !==
        'object'
    ) {

      return [];
    }


    const record =
      payload as
        Record<string, unknown>;


    const values =
      record['items']
      ??
      record['rooms']
      ??
      record['availableRooms']
      ??
      record['Items']
      ??
      record['Rooms']
      ??
      record['AvailableRooms'];


    return Array.isArray(
      values
    )
      ? this.mapRooms(
          values
        )
      : [];
  }


  // =========================================================
  // MAP ROOMS
  // =========================================================

  private mapRooms(
    values: unknown[]
  ): AvailabilityRoom[] {

    return values
      .map(
        value =>
          this.mapRoom(
            value
          )
      )
      .filter(
        (
          room
        ): room is AvailabilityRoom =>
          room !== null
      );
  }


  // =========================================================
  // MAP ROOM
  // =========================================================

  private mapRoom(
    value: unknown
  ): AvailabilityRoom | null {

    if (
      value === null
      ||
      typeof value !==
        'object'
    ) {

      return null;
    }


    const record =
      value as
        Record<string, unknown>;


    const id =
      this.stringValue(
        record['id']
        ??
        record['Id']
      );


    const roomNumber =
      this.stringValue(
        record['roomNumber']
        ??
        record['RoomNumber']
      );


    const roomTypeId =
      this.stringValue(
        record['roomTypeId']
        ??
        record['RoomTypeId']
      );


    const roomTypeName =
      this.stringValue(
        record['roomTypeName']
        ??
        record['RoomTypeName']
      );


    const status =
      this.stringValue(
        record['status']
        ??
        record['Status']
      );


    const baseRate =
      this.numberValue(
        record['baseRate']
        ??
        record['BaseRate']
      );


    if (
      !id
      ||
      !roomNumber
      ||
      !roomTypeId
      ||
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


  // =========================================================
  // NORMALIZE ROOM TYPES
  // =========================================================

  private normalizeRoomTypes(
    response: unknown
  ): AvailabilityRoomTypeOption[] {

    const payload =
      this.unwrapData(
        response
      );


    let values:
      unknown[] = [];


    if (
      Array.isArray(
        payload
      )
    ) {

      values =
        payload;
    }

    else if (
      payload !== null
      &&
      typeof payload ===
        'object'
    ) {

      const record =
        payload as
          Record<string, unknown>;


      const candidate =
        record['items']
        ??
        record['roomTypes']
        ??
        record['Items']
        ??
        record['RoomTypes'];


      if (
        Array.isArray(
          candidate
        )
      ) {

        values =
          candidate;
      }
    }


    return values
      .map(
        value =>
          this.mapRoomType(
            value
          )
      )
      .filter(
        (
          item
        ): item is AvailabilityRoomTypeOption =>
          item !== null
      )
      .sort(
        (
          left,
          right
        ) =>
          left.name.localeCompare(
            right.name
          )
      );
  }


  // =========================================================
  // MAP ROOM TYPE
  // =========================================================

  private mapRoomType(
    value: unknown
  ): AvailabilityRoomTypeOption | null {

    if (
      value === null
      ||
      typeof value !==
        'object'
    ) {

      return null;
    }


    const record =
      value as
        Record<string, unknown>;


    const id =
      this.stringValue(
        record['id']
        ??
        record['Id']
      );


    const name =
      this.stringValue(
        record['name']
        ??
        record['Name']
      );


    if (
      !id ||
      !name
    ) {

      return null;
    }


    return {
      id,
      name
    };
  }


  // =========================================================
  // UNWRAP API RESPONSE
  // =========================================================

  private unwrapData(
    response: unknown
  ): unknown {

    if (
      response !== null
      &&
      typeof response ===
        'object'
      &&
      'data' in response
    ) {

      return (
        response as
          Record<string, unknown>
      )['data'];
    }


    return response;
  }


  // =========================================================
  // STRING
  // =========================================================

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


    return String(
      value
    );
  }


  // =========================================================
  // NUMBER
  // =========================================================

  private numberValue(
    value: unknown
  ): number {

    const number =
      Number(
        value
      );


    return Number.isFinite(
      number
    )
      ? number
      : 0;
  }
}
