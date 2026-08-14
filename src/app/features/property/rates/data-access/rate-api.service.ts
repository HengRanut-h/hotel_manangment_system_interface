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
  Rate,
  RateQuery,
  CreateRateRequest,
  PagedResult,
  UpdateRateRequest
} from '../models/rate.model';

@Injectable({
  providedIn: 'root'
})
export class RateApiService {

  private readonly api =
    inject(
      ApiClientService
    );

  getPage(
    query: RateQuery = {}
  ): Observable<PagedResult<Rate>> {

    const pageNumber =
      query.pageNumber ?? 1;

    const pageSize =
      query.pageSize ?? 20;

    return this.api
      .getResponse<Rate[]>(
        'rates',
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
  ): Observable<Rate> {

    return this.api
      .get<Rate>(
        `rates/${id}`
      );
  }

  create(
    request: CreateRateRequest
  ): Observable<Rate> {

    return this.api
      .post<Rate>(
        'rates',
        {
          name:
            request.name,
          code:
            request.code,
          description:
            request.description || null
        }
      );
  }

  update(
    id: string,
    request: UpdateRateRequest
  ): Observable<Rate> {

    return this.api
      .put<Rate>(
        `rates/${id}`,
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
  ): Observable<Rate> {

    return this.api
      .patch<Rate>(
        `rates/${id}/active`,
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
        `rates/${id}`
      );
  }

  private toPagedResult(
    items: Rate[],
    pagination: PaginationMeta | undefined,
    fallbackPageNumber: number,
    fallbackPageSize: number
  ): PagedResult<Rate> {

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
