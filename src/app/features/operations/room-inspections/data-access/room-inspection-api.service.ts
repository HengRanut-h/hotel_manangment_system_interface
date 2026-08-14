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
  RoomInspection,
  RoomInspectionCreateRequest,
  RoomInspectionListRequest,
  RoomInspectionListResponse,
  RoomInspectionUpdateRequest
} from '../models/room-inspection.model';

const fallbackPagination = (
  items: RoomInspection[],
  request: RoomInspectionListRequest
): PaginationMeta => {
  const pageSize =
    request.pageSize || 20;

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        items.length /
        pageSize
      )
    );

  return {
    pageNumber:
      request.pageNumber,
    pageSize,
    totalItems:
      items.length,
    totalPages,
    hasPreviousPage:
      request.pageNumber > 1,
    hasNextPage:
      request.pageNumber < totalPages
  };
};

@Injectable({
  providedIn: 'root'
})
export class RoomInspectionApiService {

  private readonly api =
    inject(
      ApiClientService
    );

  getAll(
    request: RoomInspectionListRequest
  ): Observable<RoomInspectionListResponse> {

    return this.api
      .getResponse<RoomInspection[]>(
        'room-inspections',
        {
          pageNumber:
            request.pageNumber,
          pageSize:
            request.pageSize,
          search:
            request.search,
          status:
            request.status,
          sortBy:
            request.sortBy ?? 'createdAt',
          sortDirection:
            request.sortDirection ?? 'desc'
        }
      )
      .pipe(
        map(
          response => {
            const items =
              response.data ?? [];

            return {
              items,
              pagination:
                response.meta?.pagination ??
                fallbackPagination(
                  items,
                  request
                )
            };
          }
        )
      );
  }

  getById(
    id: string
  ): Observable<RoomInspection> {

    return this.api
      .get<RoomInspection>(
        `room-inspections/${id}`
      );
  }

  create(
    request: RoomInspectionCreateRequest
  ): Observable<RoomInspection> {

    return this.api
      .post<RoomInspection>(
        'room-inspections',
        request
      );
  }

  update(
    id: string,
    request: RoomInspectionUpdateRequest
  ): Observable<RoomInspection> {

    return this.api
      .put<RoomInspection>(
        `room-inspections/${id}`,
        request
      );
  }

  changeStatus(
    id: string,
    status: string
  ): Observable<unknown> {

    return this.api
      .patch<unknown>(
        `room-inspections/${id}/status`,
        {
          status
        }
      );
  }

  delete(
    id: string
  ): Observable<void> {

    return this.api
      .delete<void>(
        `room-inspections/${id}`
      );
  }

}
