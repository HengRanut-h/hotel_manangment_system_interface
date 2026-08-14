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
  Shift,
  ShiftQuery,
  CreateShiftRequest,
  PagedResult,
  UpdateShiftRequest
} from '../models/shift.model';

@Injectable({
  providedIn: 'root'
})
export class ShiftApiService {

  private readonly api =
    inject(
      ApiClientService
    );

  getPage(
    query: ShiftQuery = {}
  ): Observable<PagedResult<Shift>> {

    const pageNumber =
      query.pageNumber ?? 1;

    const pageSize =
      query.pageSize ?? 20;

    return this.api
      .getResponse<Shift[]>(
        'shifts',
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
  ): Observable<Shift> {

    return this.api
      .get<Shift>(
        `shifts/${id}`
      );
  }

  create(
    request: CreateShiftRequest
  ): Observable<Shift> {

    return this.api
      .post<Shift>(
        'shifts',
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
    request: UpdateShiftRequest
  ): Observable<Shift> {

    return this.api
      .put<Shift>(
        `shifts/${id}`,
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
  ): Observable<Shift> {

    return this.api
      .patch<Shift>(
        `shifts/${id}/active`,
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
        `shifts/${id}`
      );
  }

  private toPagedResult(
    items: Shift[],
    pagination: PaginationMeta | undefined,
    fallbackPageNumber: number,
    fallbackPageSize: number
  ): PagedResult<Shift> {

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
