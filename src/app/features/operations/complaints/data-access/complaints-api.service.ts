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
  ApiResponse,
  ChangeComplaintStatusRequest,
  CreateComplaintRequest,
  Complaint,
  ComplaintQuery,
  PagedResult,
  UpdateComplaintRequest
} from '../models/complaint.model';

@Injectable({
  providedIn: 'root'
})
export class ComplaintsApiService {

  private readonly api =
    inject(ApiClientService);

  getPage(
    query: ComplaintQuery = {}
  ): Observable<PagedResult<Complaint>> {

    const params:
      Record<string, string | number> = {
        sortBy:
          query.sortBy ?? 'createdAt',
        sortDirection:
          query.sortDirection ?? 'desc',
        pageNumber:
          query.pageNumber ?? 1,
        pageSize:
          query.pageSize ?? 20
      };

    const search =
      query.search?.trim();

    const status =
      query.status?.trim();

    const relatedEntityType =
      query.relatedEntityType?.trim();

    const from =
      query.from?.trim();

    const to =
      query.to?.trim();

    if (search) {
      params['search'] = search;
    }

    if (status) {
      params['status'] = status;
    }

    if (relatedEntityType) {
      params['relatedEntityType'] =
        relatedEntityType;
    }

    if (from) {
      params['from'] = from;
    }

    if (to) {
      params['to'] = to;
    }

    return this.api
      .get<
        ApiResponse<PagedResult<Complaint>>
        |
        PagedResult<Complaint>
      >(
        'complaints',
        params
      )
      .pipe(
        map(
          response =>
            this.unwrap(response)
        )
      );
  }

  getById(
    id: string
  ): Observable<Complaint> {

    return this.api
      .get<
        ApiResponse<Complaint>
        |
        Complaint
      >(
        `complaints/${id}`
      )
      .pipe(
        map(
          response =>
            this.unwrap(response)
        )
      );
  }

  create(
    request: CreateComplaintRequest
  ): Observable<Complaint> {

    return this.api
      .post<
        ApiResponse<Complaint>
        |
        Complaint
      >(
        'complaints',
        request
      )
      .pipe(
        map(
          response =>
            this.unwrap(response)
        )
      );
  }

  update(
    id: string,
    request: UpdateComplaintRequest
  ): Observable<Complaint> {

    return this.api
      .put<
        ApiResponse<Complaint>
        |
        Complaint
      >(
        `complaints/${id}`,
        request
      )
      .pipe(
        map(
          response =>
            this.unwrap(response)
        )
      );
  }

  changeStatus(
    id: string,
    request: ChangeComplaintStatusRequest
  ): Observable<Complaint> {

    return this.api
      .patch<
        ApiResponse<Complaint>
        |
        Complaint
      >(
        `complaints/${id}/status`,
        request
      )
      .pipe(
        map(
          response =>
            this.unwrap(response)
        )
      );
  }

  delete(
    id: string
  ): Observable<void> {

    return this.api
      .delete<void>(
        `complaints/${id}`
      );
  }

  private unwrap<T>(
    response: ApiResponse<T> | T
  ): T {

    if (
      response !== null
      &&
      typeof response === 'object'
      &&
      'data' in response
    ) {
      return (
        response as ApiResponse<T>
      ).data;
    }

    return response as T;
  }
}
