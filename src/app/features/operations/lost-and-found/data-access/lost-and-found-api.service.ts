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
  ChangeLostAndFoundStatusRequest,
  CreateLostAndFoundRequest,
  LostAndFoundItem,
  LostAndFoundQuery,
  PagedResult,
  UpdateLostAndFoundRequest
} from '../models/lost-and-found-item.model';

@Injectable({
  providedIn: 'root'
})
export class LostAndFoundApiService {

  private readonly api =
    inject(ApiClientService);

  getPage(
    query: LostAndFoundQuery = {}
  ): Observable<PagedResult<LostAndFoundItem>> {

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
        ApiResponse<PagedResult<LostAndFoundItem>>
        |
        PagedResult<LostAndFoundItem>
      >(
        'lost-and-found',
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
  ): Observable<LostAndFoundItem> {

    return this.api
      .get<
        ApiResponse<LostAndFoundItem>
        |
        LostAndFoundItem
      >(
        `lost-and-found/${id}`
      )
      .pipe(
        map(
          response =>
            this.unwrap(response)
        )
      );
  }

  create(
    request: CreateLostAndFoundRequest
  ): Observable<LostAndFoundItem> {

    return this.api
      .post<
        ApiResponse<LostAndFoundItem>
        |
        LostAndFoundItem
      >(
        'lost-and-found',
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
    request: UpdateLostAndFoundRequest
  ): Observable<LostAndFoundItem> {

    return this.api
      .put<
        ApiResponse<LostAndFoundItem>
        |
        LostAndFoundItem
      >(
        `lost-and-found/${id}`,
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
    request: ChangeLostAndFoundStatusRequest
  ): Observable<LostAndFoundItem> {

    return this.api
      .patch<
        ApiResponse<LostAndFoundItem>
        |
        LostAndFoundItem
      >(
        `lost-and-found/${id}/status`,
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
        `lost-and-found/${id}`
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
