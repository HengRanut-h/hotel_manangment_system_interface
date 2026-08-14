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
  Position,
  PositionQuery,
  CreatePositionRequest,
  PagedResult,
  UpdatePositionRequest
} from '../models/position.model';

@Injectable({
  providedIn: 'root'
})
export class PositionApiService {

  private readonly api =
    inject(
      ApiClientService
    );

  getPage(
    query: PositionQuery = {}
  ): Observable<PagedResult<Position>> {

    const pageNumber =
      query.pageNumber ?? 1;

    const pageSize =
      query.pageSize ?? 20;

    return this.api
      .getResponse<Position[]>(
        'positions',
        {
          pageNumber,
          pageSize,
          search:
            query.search?.trim(),
          isActive:
            query.isActive,
          sortBy:
            query.sortBy,
          sortDirection:
            query.sortDirection
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
  ): Observable<Position> {

    return this.api
      .get<Position>(
        `positions/${id}`
      );
  }

  create(
    request: CreatePositionRequest
  ): Observable<Position> {

    return this.api
      .post<Position>(
        'positions',
        {
          name:
            request.name,
          code:
            request.code,
          description:
            request.description || null,
          branchId:
            request.branchId || null
        }
      );
  }

  update(
    id: string,
    request: UpdatePositionRequest
  ): Observable<Position> {

    return this.api
      .put<Position>(
        `positions/${id}`,
        {
          name:
            request.name,
          code:
            request.code,
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
  ): Observable<Position> {

    return this.api
      .patch<Position>(
        `positions/${id}/active`,
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
        `positions/${id}`
      );
  }

  private toPagedResult(
    items: Position[],
    pagination: PaginationMeta | undefined,
    fallbackPageNumber: number,
    fallbackPageSize: number
  ): PagedResult<Position> {

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
