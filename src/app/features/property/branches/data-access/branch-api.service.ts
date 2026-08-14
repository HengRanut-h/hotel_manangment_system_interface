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
  Branch,
  BranchQuery,
  CreateBranchRequest,
  PagedResult,
  UpdateBranchRequest
} from '../models/branch.model';

@Injectable({
  providedIn: 'root'
})
export class BranchApiService {

  private readonly api =
    inject(
      ApiClientService
    );

  getPage(
    query: BranchQuery = {}
  ): Observable<PagedResult<Branch>> {

    const pageNumber =
      query.pageNumber ?? 1;

    const pageSize =
      query.pageSize ?? 20;

    return this.api
      .getResponse<Branch[]>(
        'branches',
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
  ): Observable<Branch> {

    return this.api
      .get<Branch>(
        `branches/${id}`
      );
  }

  create(
    request: CreateBranchRequest
  ): Observable<Branch> {

    return this.api
      .post<Branch>(
        'branches',
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
    request: UpdateBranchRequest
  ): Observable<Branch> {

    return this.api
      .put<Branch>(
        `branches/${id}`,
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
  ): Observable<Branch> {

    return this.api
      .patch<Branch>(
        `branches/${id}/active`,
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
        `branches/${id}`
      );
  }

  private toPagedResult(
    items: Branch[],
    pagination: PaginationMeta | undefined,
    fallbackPageNumber: number,
    fallbackPageSize: number
  ): PagedResult<Branch> {

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
