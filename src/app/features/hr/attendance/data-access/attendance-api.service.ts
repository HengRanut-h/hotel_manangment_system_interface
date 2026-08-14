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
  AttendanceQuery,
  AttendanceRecord,
  CreateAttendanceRequest,
  PagedResult,
  UpdateAttendanceRequest
} from '../models/attendance.model';

@Injectable({
  providedIn: 'root'
})
export class AttendanceApiService {

  private readonly api =
    inject(
      ApiClientService
    );

  getPage(
    query: AttendanceQuery = {}
  ): Observable<PagedResult<AttendanceRecord>> {

    const pageNumber =
      query.pageNumber ?? 1;

    const pageSize =
      query.pageSize ?? 20;

    return this.api
      .getResponse<AttendanceRecord[]>(
        'attendance',
        {
          pageNumber,
          pageSize,
          search:
            query.search?.trim(),
          status:
            query.status?.trim() || undefined,
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
  ): Observable<AttendanceRecord> {

    return this.api
      .get<AttendanceRecord>(
        `attendance/${id}`
      );
  }

  create(
    request: CreateAttendanceRequest
  ): Observable<AttendanceRecord> {

    return this.api
      .post<AttendanceRecord>(
        'attendance',
        {
          title:
            request.title,
          notes:
            request.notes || null,
          amount:
            request.amount ?? 0,
          eventAtUtc:
            request.eventAtUtc || null,
          branchId:
            request.branchId || null,
          relatedEntityId:
            request.relatedEntityId || null,
          relatedEntityType:
            request.relatedEntityType || null,
          status:
            request.status || 'Open'
        }
      );
  }

  update(
    id: string,
    request: UpdateAttendanceRequest
  ): Observable<AttendanceRecord> {

    return this.api
      .put<AttendanceRecord>(
        `attendance/${id}`,
        {
          title:
            request.title,
          notes:
            request.notes || null,
          amount:
            request.amount,
          eventAtUtc:
            request.eventAtUtc,
          relatedEntityId:
            request.relatedEntityId || null,
          relatedEntityType:
            request.relatedEntityType || null
        }
      );
  }

  changeStatus(
    id: string,
    status: string
  ): Observable<AttendanceRecord> {

    return this.api
      .patch<AttendanceRecord>(
        `attendance/${id}/status`,
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
        `attendance/${id}`
      );
  }

  private toPagedResult(
    items: AttendanceRecord[],
    pagination: PaginationMeta | undefined,
    fallbackPageNumber: number,
    fallbackPageSize: number
  ): PagedResult<AttendanceRecord> {

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
