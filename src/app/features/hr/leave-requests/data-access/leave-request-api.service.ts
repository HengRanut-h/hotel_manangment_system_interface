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
  LeaveRequestQuery,
  LeaveRequestRecord,
  CreateLeaveRequestRequest,
  PagedResult,
  UpdateLeaveRequestRequest
} from '../models/leave-request.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveRequestApiService {

  private readonly api =
    inject(
      ApiClientService
    );

  getPage(
    query: LeaveRequestQuery = {}
  ): Observable<PagedResult<LeaveRequestRecord>> {

    const pageNumber =
      query.pageNumber ?? 1;

    const pageSize =
      query.pageSize ?? 20;

    return this.api
      .getResponse<LeaveRequestRecord[]>(
        'leave-requests',
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
  ): Observable<LeaveRequestRecord> {

    return this.api
      .get<LeaveRequestRecord>(
        `leave-requests/${id}`
      );
  }

  create(
    request: CreateLeaveRequestRequest
  ): Observable<LeaveRequestRecord> {

    return this.api
      .post<LeaveRequestRecord>(
        'leave-requests',
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
            request.status || 'Pending'
        }
      );
  }

  update(
    id: string,
    request: UpdateLeaveRequestRequest
  ): Observable<LeaveRequestRecord> {

    return this.api
      .put<LeaveRequestRecord>(
        `leave-requests/${id}`,
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
  ): Observable<LeaveRequestRecord> {

    return this.api
      .patch<LeaveRequestRecord>(
        `leave-requests/${id}/status`,
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
        `leave-requests/${id}`
      );
  }

  private toPagedResult(
    items: LeaveRequestRecord[],
    pagination: PaginationMeta | undefined,
    fallbackPageNumber: number,
    fallbackPageSize: number
  ): PagedResult<LeaveRequestRecord> {

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
