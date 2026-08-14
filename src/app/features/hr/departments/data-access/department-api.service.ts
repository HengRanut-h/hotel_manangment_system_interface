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
  Department,
  DepartmentQuery,
  CreateDepartmentRequest,
  PagedResult,
  UpdateDepartmentRequest
} from '../models/department.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentApiService {

  private readonly api =
    inject(
      ApiClientService
    );

  getPage(
    query: DepartmentQuery = {}
  ): Observable<PagedResult<Department>> {

    const pageNumber =
      query.pageNumber ?? 1;

    const pageSize =
      query.pageSize ?? 20;

    return this.api
      .getResponse<Department[]>(
        'departments',
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
  ): Observable<Department> {

    return this.api
      .get<Department>(
        `departments/${id}`
      );
  }

  create(
    request: CreateDepartmentRequest
  ): Observable<Department> {

    return this.api
      .post<Department>(
        'departments',
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
    request: UpdateDepartmentRequest
  ): Observable<Department> {

    return this.api
      .put<Department>(
        `departments/${id}`,
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
  ): Observable<Department> {

    return this.api
      .patch<Department>(
        `departments/${id}/active`,
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
        `departments/${id}`
      );
  }

  private toPagedResult(
    items: Department[],
    pagination: PaginationMeta | undefined,
    fallbackPageNumber: number,
    fallbackPageSize: number
  ): PagedResult<Department> {

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
