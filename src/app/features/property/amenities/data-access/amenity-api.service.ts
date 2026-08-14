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
  Amenity,
  AmenityQuery,
  CreateAmenityRequest,
  PagedResult,
  UpdateAmenityRequest
} from '../models/amenity.model';

@Injectable({
  providedIn: 'root'
})
export class AmenityApiService {

  private readonly api =
    inject(
      ApiClientService
    );

  getPage(
    query: AmenityQuery = {}
  ): Observable<PagedResult<Amenity>> {

    const pageNumber =
      query.pageNumber ?? 1;

    const pageSize =
      query.pageSize ?? 20;

    return this.api
      .getResponse<Amenity[]>(
        'amenities',
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
  ): Observable<Amenity> {

    return this.api
      .get<Amenity>(
        `amenities/${id}`
      );
  }

  create(
    request: CreateAmenityRequest
  ): Observable<Amenity> {

    return this.api
      .post<Amenity>(
        'amenities',
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
    request: UpdateAmenityRequest
  ): Observable<Amenity> {

    return this.api
      .put<Amenity>(
        `amenities/${id}`,
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
  ): Observable<Amenity> {

    return this.api
      .patch<Amenity>(
        `amenities/${id}/active`,
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
        `amenities/${id}`
      );
  }

  private toPagedResult(
    items: Amenity[],
    pagination: PaginationMeta | undefined,
    fallbackPageNumber: number,
    fallbackPageSize: number
  ): PagedResult<Amenity> {

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
