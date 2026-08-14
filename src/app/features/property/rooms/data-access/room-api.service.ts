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
  PaginationMeta
} from '../../../../core/http/api-response.models';

import {
  ChangeRoomStatusRequest,
  CreateRoomRequest,
  PagedResult,
  Room,
  RoomQuery,
  UpdateRoomRequest
} from '../models/room.model';

@Injectable({
  providedIn: 'root'
})
export class RoomApiService {

  private readonly api =
    inject(
      ApiClientService
    );

  getPage(
    query: RoomQuery = {}
  ): Observable<PagedResult<Room>> {

    const pageNumber =
      query.pageNumber ?? 1;

    const pageSize =
      query.pageSize ?? 20;

    return this.api
      .getResponse<Room[]>(
        'rooms',
        {
          pageNumber,
          pageSize,
          search:
            query.search?.trim()
        }
      )
      .pipe(
        map(
          response =>
            this.toPagedResult(
              response.data ?? [],
              response.meta?.pagination,
              pageNumber,
              pageSize
            )
        )
      );
  }

  getById(
    id: string
  ): Observable<Room> {

    return this.api
      .get<Room>(
        `rooms/${id}`
      );
  }

  create(
    request: CreateRoomRequest
  ): Observable<Room> {

    return this.api
      .post<Room>(
        'rooms',
        {
          branchId:
            request.branchId || null,
          roomTypeId:
            request.roomTypeId,
          roomNumber:
            request.roomNumber,
          floor:
            request.floor
        }
      );
  }

  update(
    id: string,
    request: UpdateRoomRequest
  ): Observable<Room> {

    return this.api
      .put<Room>(
        `rooms/${id}`,
        {
          roomTypeId:
            request.roomTypeId,
          roomNumber:
            request.roomNumber,
          floor:
            request.floor
        }
      );
  }

  changeStatus(
    id: string,
    request: ChangeRoomStatusRequest
  ): Observable<unknown> {

    return this.api
      .patch<unknown>(
        `rooms/${id}/status`,
        {
          status:
            request.status
        }
      );
  }

  delete(
    id: string
  ): Observable<void> {

    return this.api
      .delete<void>(
        `rooms/${id}`
      );
  }

  private toPagedResult(
    items: Room[],
    pagination: PaginationMeta | undefined,
    fallbackPageNumber: number,
    fallbackPageSize: number
  ): PagedResult<Room> {

    const totalItems =
      pagination?.totalItems ?? items.length;

    const pageSize =
      pagination?.pageSize ?? fallbackPageSize;

    const pageNumber =
      pagination?.pageNumber ?? fallbackPageNumber;

    const totalPages =
      pagination?.totalPages
      ??
      Math.max(
        1,
        Math.ceil(
          totalItems /
          pageSize
        )
      );

    return {
      items,
      pageNumber,
      pageSize,
      totalItems,
      totalPages,
      hasPreviousPage:
        pagination?.hasPreviousPage
        ??
        pageNumber > 1,
      hasNextPage:
        pagination?.hasNextPage
        ??
        pageNumber < totalPages
    };
  }

}
