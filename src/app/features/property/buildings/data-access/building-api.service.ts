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
  Building,
  BuildingBranchOption,
  BuildingQuery,
  CreateBuildingRequest,
  PagedResult,
  UpdateBuildingRequest
} from '../models/building.model';

@Injectable({
  providedIn: 'root'
})
export class BuildingApiService {

  private readonly api =
    inject(
      ApiClientService
    );

  getPage(
    query: BuildingQuery = {}
  ): Observable<PagedResult<Building>> {

    const pageNumber =
      query.pageNumber ?? 1;

    const pageSize =
      query.pageSize ?? 20;

    return this.api
      .getResponse<Building[]>(
        'buildings',
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
  ): Observable<Building> {

    return this.api
      .get<Building>(
        `buildings/${id}`
      );
  }

  create(
    request: CreateBuildingRequest
  ): Observable<Building> {

    return this.api
      .post<Building>(
        'buildings',
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
    request: UpdateBuildingRequest
  ): Observable<Building> {

    return this.api
      .put<Building>(
        `buildings/${id}`,
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
  ): Observable<Building> {

    return this.api
      .patch<Building>(
        `buildings/${id}/active`,
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
        `buildings/${id}`
      );
  }

  getBranchOptions(): Observable<BuildingBranchOption[]> {

    return this.api
      .getResponse<BuildingBranchOption[]>(
        'branches',
        {
          pageNumber: 1,
          pageSize: 100,
          sortBy: 'name',
          sortDirection: 'asc'
        }
      )
      .pipe(
        map(
          response =>
            response.data ?? []
        )
      );
  }

  private toPagedResult(
    items: Building[],
    pagination: PaginationMeta | undefined,
    fallbackPageNumber: number,
    fallbackPageSize: number
  ): PagedResult<Building> {

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
