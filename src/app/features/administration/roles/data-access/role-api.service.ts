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
  Role,
  RoleRequest,
  SetRolePermissionsRequest
} from '../models/role.model';

type RoleListApiResponse =
  ApiResponse<Role[]> |
  Role[];

type RoleApiResponse =
  ApiResponse<Role> |
  Role;

@Injectable({
  providedIn: 'root'
})
export class RoleApiService {

  private readonly api =
    inject(ApiClientService);


  // =========================================================
  // GET ALL
  // GET /api/v1/roles
  // =========================================================

  getAll():
    Observable<Role[]> {

    return this.api
      .get<RoleListApiResponse>(
        'roles'
      )
      .pipe(
        map(
          response => {

            // ApiClientService already unwrapped data.
            if (
              Array.isArray(response)
            ) {
              return response;
            }

            // Raw backend ApiResponse<T>.
            if (
              Array.isArray(response?.data)
            ) {
              return response.data;
            }

            return [];
          }
        )
      );
  }


  // =========================================================
  // GET BY ID
  // GET /api/v1/roles/{id}
  // =========================================================

  getById(
    id: string
  ):
    Observable<Role> {

    return this.api
      .get<RoleApiResponse>(
        `roles/${id}`
      )
      .pipe(
        map(
          response =>
            this.unwrapRole(response)
        )
      );
  }


  // =========================================================
  // CREATE
  // POST /api/v1/roles
  // =========================================================

  create(
    request: RoleRequest
  ):
    Observable<Role> {

    return this.api
      .post<RoleApiResponse>(
        'roles',
        request
      )
      .pipe(
        map(
          response =>
            this.unwrapRole(response)
        )
      );
  }


  // =========================================================
  // UPDATE
  // PUT /api/v1/roles/{id}
  // =========================================================

  update(
    id: string,
    request: RoleRequest
  ):
    Observable<Role> {

    return this.api
      .put<RoleApiResponse>(
        `roles/${id}`,
        request
      )
      .pipe(
        map(
          response =>
            this.unwrapRole(response)
        )
      );
  }


  // =========================================================
  // SET PERMISSIONS
  // PUT /api/v1/roles/{id}/permissions
  // =========================================================

  setPermissions(
    id: string,
    request: SetRolePermissionsRequest
  ):
    Observable<void> {

    return this.api
      .put<unknown>(
        `roles/${id}/permissions`,
        request
      )
      .pipe(
        map(
          () =>
            void 0
        )
      );
  }


  // =========================================================
  // DELETE
  // DELETE /api/v1/roles/{id}
  // =========================================================

  delete(
    id: string
  ):
    Observable<void> {

    return this.api
      .delete<void>(
        `roles/${id}`
      );
  }


  // =========================================================
  // PRIVATE
  // =========================================================

  private unwrapRole(
    response:
      RoleApiResponse
  ):
    Role {

    if (
      this.isApiResponse(response)
    ) {
      return response.data;
    }

    return response;
  }


  private isApiResponse(
    response:
      RoleApiResponse
  ):
    response is ApiResponse<Role> {

    return (
      response !== null
      &&
      typeof response === 'object'
      &&
      'data' in response
    );
  }
}
