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
  ChangeSecurityIncidentStatusRequest,
  CreateSecurityIncidentRequest,
  PagedResult,
  SecurityIncident,
  SecurityIncidentQuery,
  UpdateSecurityIncidentRequest
} from '../models/security-incident.model';

@Injectable({
  providedIn: 'root'
})
export class SecurityIncidentsApiService {

  private readonly api =
    inject(ApiClientService);

  getPage(
    query: SecurityIncidentQuery = {}
  ): Observable<PagedResult<SecurityIncident>> {

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
        ApiResponse<PagedResult<SecurityIncident>>
        |
        PagedResult<SecurityIncident>
      >(
        'security-incidents',
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
  ): Observable<SecurityIncident> {

    return this.api
      .get<
        ApiResponse<SecurityIncident>
        |
        SecurityIncident
      >(
        `security-incidents/${id}`
      )
      .pipe(
        map(
          response =>
            this.unwrap(response)
        )
      );
  }

  create(
    request: CreateSecurityIncidentRequest
  ): Observable<SecurityIncident> {

    return this.api
      .post<
        ApiResponse<SecurityIncident>
        |
        SecurityIncident
      >(
        'security-incidents',
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
    request: UpdateSecurityIncidentRequest
  ): Observable<SecurityIncident> {

    return this.api
      .put<
        ApiResponse<SecurityIncident>
        |
        SecurityIncident
      >(
        `security-incidents/${id}`,
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
    request: ChangeSecurityIncidentStatusRequest
  ): Observable<SecurityIncident> {

    return this.api
      .patch<
        ApiResponse<SecurityIncident>
        |
        SecurityIncident
      >(
        `security-incidents/${id}/status`,
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
        `security-incidents/${id}`
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
