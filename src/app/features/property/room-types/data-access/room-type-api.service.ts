import {
  inject,
  Injectable
} from '@angular/core';

import {
  map,
  Observable
} from 'rxjs';

import {
  PaginationMeta
} from '../../../../core/http/api-response.models';

import {
  ApiClientService
} from '../../../../core/http/api-client.service';

import {
  RoomType,
  RoomTypeQuery,
  CreateRoomTypeRequest,
  PagedResult,
  UpdateRoomTypeRequest
} from '../models/room-type.model';

@Injectable({
  providedIn: 'root'
})
export class RoomTypeApiService {

  private readonly api =
    inject(
      ApiClientService
    );

  getPage(
    query: RoomTypeQuery = {}
  ): Observable<PagedResult<RoomType>> {

    const pageNumber =
      query.pageNumber ?? 1;

    const pageSize =
      query.pageSize ?? 20;

    return this.api
      .getResponse<RoomType[]>(
        'room-types',
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
  ): Observable<RoomType> {

    return this.api
      .get<RoomType>(
        `room-types/${id}`
      );
  }

  create(
    request: CreateRoomTypeRequest
  ): Observable<RoomType> {

    return this.api
      .post<RoomType>(
        'room-types',
        {
          name:
            request.name,
          code:
            request.code,
          baseRate:
            request.baseRate,
          maxAdults:
            request.maxAdults,
          maxChildren:
            request.maxChildren,
          description:
            request.description || null,
          isActive:
            request.isActive
        }
      );
  }

  update(
    id: string,
    request: UpdateRoomTypeRequest
  ): Observable<RoomType> {

    return this.api
      .put<RoomType>(
        `room-types/${id}`,
        {
          name:
            request.name,
          code:
            request.code,
          baseRate:
            request.baseRate,
          maxAdults:
            request.maxAdults,
          maxChildren:
            request.maxChildren,
          description:
            request.description || null,
          isActive:
            request.isActive
        }
      );
  }

  setActive(
    id: string,
    isActive: boolean
  ): Observable<RoomType> {

    return this.api
      .patch<RoomType>(
        `room-types/${id}/active`,
        {
          isActive
        }
      );
  }

  delete(
    id: string
  ): Observable<void> {

    return this.api
      .delete<void>(
        `room-types/${id}`
      );
  }

  private toPagedResult(
    items: RoomType[],
    pagination: PaginationMeta | undefined,
    fallbackPageNumber: number,
    fallbackPageSize: number
  ): PagedResult<RoomType> {

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
