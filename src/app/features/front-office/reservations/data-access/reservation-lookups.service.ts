import {
  inject,
  Injectable
} from '@angular/core';

import {
  forkJoin,
  map,
  Observable
} from 'rxjs';

import {
  ApiClientService
} from '../../../../core/http/api-client.service';

import {
  ApiResponse,
  GuestLookup,
  RoomLookup,
  RoomTypeLookup
} from '../models/reservation.model';

export interface ReservationLookups {
  guests: GuestLookup[];
  roomTypes: RoomTypeLookup[];
  rooms: RoomLookup[];
}

@Injectable({
  providedIn: 'root'
})
export class ReservationLookupsService {

  private readonly api =
    inject(ApiClientService);

  load():
    Observable<ReservationLookups> {

    return forkJoin({
      guests:
        this.api.get<
          ApiResponse<unknown>
          |
          unknown
        >(
          'guests'
        ),

      roomTypes:
        this.api.get<
          ApiResponse<unknown>
          |
          unknown
        >(
          'room-types'
        ),

      rooms:
        this.api.get<
          ApiResponse<unknown>
          |
          unknown
        >(
          'rooms'
        )
    })
      .pipe(
        map(
          result => ({
            guests:
              this.normalizeGuests(
                this.unwrap(
                  result.guests
                )
              ),

            roomTypes:
              this.normalizeRoomTypes(
                this.unwrap(
                  result.roomTypes
                )
              ),

            rooms:
              this.normalizeRooms(
                this.unwrap(
                  result.rooms
                )
              )
          })
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

  private collection(
    payload: unknown
  ): unknown[] {

    if (
      Array.isArray(payload)
    ) {
      return payload;
    }

    if (
      payload === null
      ||
      typeof payload !== 'object'
    ) {
      return [];
    }

    const record =
      payload as Record<string, unknown>;

    const items =
      record['items']
      ??
      record['Items']
      ??
      record['data']
      ??
      record['Data'];

    return Array.isArray(items)
      ? items
      : [];
  }

  private normalizeGuests(
    payload: unknown
  ): GuestLookup[] {

    return this.collection(payload)
      .map(
        value => {

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

          const firstName =
            this.stringValue(
              row['firstName']
              ??
              row['FirstName']
            );

          const lastName =
            this.stringValue(
              row['lastName']
              ??
              row['LastName']
            );

          const fullName =
            this.stringValue(
              row['fullName']
              ??
              row['FullName']
            )
            ||
            `${firstName} ${lastName}`
              .trim();

          return {
            id,

            fullName:
              fullName
              ||
              id,

            phone:
              this.nullableString(
                row['phone']
                ??
                row['Phone']
              ),

            email:
              this.nullableString(
                row['email']
                ??
                row['Email']
              )
          };
        }
      )
      .filter(
        (
          item
        ): item is GuestLookup =>
          item !== null
      )
      .sort(
        (
          left,
          right
        ) =>
          left.fullName.localeCompare(
            right.fullName
          )
      );
  }

  private normalizeRoomTypes(
    payload: unknown
  ): RoomTypeLookup[] {

    return this.collection(payload)
      .map(
        value => {

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

          const name =
            this.stringValue(
              row['name']
              ??
              row['Name']
            );

          if (
            !id
            ||
            !name
          ) {
            return null;
          }

          return {
            id,
            name,

            code:
              this.nullableString(
                row['code']
                ??
                row['Code']
              ),

            baseRate:
              this.numberValue(
                row['baseRate']
                ??
                row['BaseRate']
              )
          };
        }
      )
      .filter(
        (
          item
        ): item is RoomTypeLookup =>
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

  private normalizeRooms(
    payload: unknown
  ): RoomLookup[] {

    return this.collection(payload)
      .map(
        value => {

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

          const roomNumber =
            this.stringValue(
              row['roomNumber']
              ??
              row['RoomNumber']
            );

          if (
            !id
            ||
            !roomNumber
          ) {
            return null;
          }

          return {
            id,
            roomNumber,

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

            status:
              this.stringValue(
                row['status']
                ??
                row['Status']
              )
          };
        }
      )
      .filter(
        (
          item
        ): item is RoomLookup =>
          item !== null
      )
      .sort(
        (
          left,
          right
        ) =>
          left.roomNumber.localeCompare(
            right.roomNumber,
            undefined,
            {
              numeric: true
            }
          )
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
}
