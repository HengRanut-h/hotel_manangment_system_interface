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
  Floor,
  FloorQuery,
  CreateFloorRequest,
  PagedResult,
  UpdateFloorRequest
} from '../models/floor.model';

@Injectable({
  providedIn: 'root'
})
export class FloorApiService {

  private readonly api =
    inject(
      ApiClientService
    );

  getPage(
    query: FloorQuery = {}
  ): Observable<PagedResult<Floor>> {

    const pageNumber =
      query.pageNumber ?? 1;

    const pageSize =
      query.pageSize ?? 20;

    return this.api
      .getResponse<Floor[]>(
        'floors',
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
  ): Observable<Floor> {

    return this.api
      .get<Floor>(
        `floors/${id}`
      );
  }

  create(
    request: CreateFloorRequest
  ): Observable<Floor> {

    return this.api
      .post<Floor>(
        'floors',
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
    request: UpdateFloorRequest
  ): Observable<Floor> {

    return this.api
      .put<Floor>(
        `floors/${id}`,
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
  ): Observable<Floor> {

    return this.api
      .patch<Floor>(
        `floors/${id}/active`,
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
        `floors/${id}`
      );
  }

  private toPagedResult(
    items: Floor[],
    pagination: PaginationMeta | undefined,
    fallbackPageNumber: number,
    fallbackPageSize: number
  ): PagedResult<Floor> {

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
