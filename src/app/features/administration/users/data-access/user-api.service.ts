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
  CreateUserRequest,
  ResetUserPasswordRequest,
  UpdateUserRequest,
  User
} from '../models/user.model';

type UserListResponse =
  ApiResponse<User[]> |
  User[];

type UserResponse =
  ApiResponse<User> |
  User;

type RoleListResponse =
  ApiResponse<string[]> |
  string[];

@Injectable({
  providedIn:
    'root'
})
export class UserApiService {

  private readonly api =
    inject(
      ApiClientService
    );

  // =========================================================
  // USERS
  //
  // Backend already filters:
  //
  // Permission
  // + Hotel
  // + Role level
  // + Portal/domain
  // =========================================================

  getAll():
    Observable<User[]> {

    return this.api
      .get<UserListResponse>(
        'users'
      )
      .pipe(
        map(response => {

          if (
            Array.isArray(
              response
            )
          ) {
            return response;
          }

          return Array.isArray(
            response?.data
          )
            ? response.data
            : [];
        })
      );
  }

  // =========================================================
  // ASSIGNABLE ROLES
  //
  // Do not load every system role.
  //
  // Backend decides what current actor may assign.
  // =========================================================

  getAssignableRoles():
    Observable<string[]> {

    return this.api
      .get<RoleListResponse>(
        'users/assignable-roles'
      )
      .pipe(
        map(response => {

          if (
            Array.isArray(
              response
            )
          ) {
            return response;
          }

          return Array.isArray(
            response?.data
          )
            ? response.data
            : [];
        })
      );
  }

  // =========================================================
  // GET
  // =========================================================

  getById(
    id: string
  ): Observable<User> {

    return this.api
      .get<UserResponse>(
        `users/${id}`
      )
      .pipe(
        map(response =>
          this.unwrapUser(
            response
          )
        )
      );
  }

  // =========================================================
  // CREATE
  // =========================================================

  create(
    request:
      CreateUserRequest
  ): Observable<User> {

    return this.api
      .post<UserResponse>(
        'users',
        request
      )
      .pipe(
        map(response =>
          this.unwrapUser(
            response
          )
        )
      );
  }

  // =========================================================
  // UPDATE
  // =========================================================

  update(
    id: string,
    request:
      UpdateUserRequest
  ): Observable<User> {

    return this.api
      .put<UserResponse>(
        `users/${id}`,
        request
      )
      .pipe(
        map(response =>
          this.unwrapUser(
            response
          )
        )
      );
  }

  // =========================================================
  // ENABLE
  // =========================================================

  enable(
    id: string
  ): Observable<void> {

    return this.api
      .post<unknown>(
        `users/${id}/enable`,
        {}
      )
      .pipe(
        map(
          () =>
            void 0
        )
      );
  }

  // =========================================================
  // DISABLE
  // =========================================================

  disable(
    id: string
  ): Observable<void> {

    return this.api
      .post<unknown>(
        `users/${id}/disable`,
        {}
      )
      .pipe(
        map(
          () =>
            void 0
        )
      );
  }

  // =========================================================
  // RESET PASSWORD
  // =========================================================

  resetPassword(
    id: string,
    request:
      ResetUserPasswordRequest
  ): Observable<void> {

    return this.api
      .post<unknown>(
        `users/${id}/reset-password`,
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
  // =========================================================

  delete(
    id: string
  ): Observable<void> {

    return this.api
      .delete<void>(
        `users/${id}`
      );
  }

  // =========================================================
  // UNWRAP
  // =========================================================

  private unwrapUser(
    response:
      UserResponse
  ): User {

    if (
      response !== null
      &&
      typeof response ===
        'object'
      &&
      'data' in response
    ) {
      return response.data;
    }

    return response;
  }
}
