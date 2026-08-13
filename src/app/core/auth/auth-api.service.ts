import {
  HttpBackend,
  HttpClient
} from '@angular/common/http';

import {
  Injectable
} from '@angular/core';

import {
  map,
  Observable
} from 'rxjs';

import {
  environment
} from '../../../environments/environment';

import {
  unwrapApiResponse
} from '../http/api-response.models';

import {
  AuthResponse,
  LoginRequest,
  RegisterRequest
} from './auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  private readonly http:
    HttpClient;

  constructor(
    backend: HttpBackend
  ) {

    this.http =
      new HttpClient(
        backend
      );
  }

  // =========================================================
  // REGISTER
  // POST /api/v1/auth/register
  // =========================================================

  register(
    request: RegisterRequest
  ): Observable<AuthResponse> {

    return this.http
      .post<unknown>(
        `${environment.apiBaseUrl}/auth/register`,
        request
      )
      .pipe(
        map(response =>
          unwrapApiResponse<AuthResponse>(
            response
          )
        )
      );
  }

  // =========================================================
  // LOGIN
  // POST /api/v1/auth/login
  // =========================================================

  login(
    request: LoginRequest
  ): Observable<AuthResponse> {

    return this.http
      .post<unknown>(
        `${environment.apiBaseUrl}/auth/login`,
        request
      )
      .pipe(
        map(response =>
          unwrapApiResponse<AuthResponse>(
            response
          )
        )
      );
  }

  // =========================================================
  // REFRESH TOKEN
  // POST /api/v1/auth/refresh-token
  // =========================================================

  refresh(
    refreshToken: string
  ): Observable<AuthResponse> {

    return this.http
      .post<unknown>(
        `${environment.apiBaseUrl}/auth/refresh-token`,
        {
          refreshToken
        }
      )
      .pipe(
        map(response =>
          unwrapApiResponse<AuthResponse>(
            response
          )
        )
      );
  }

  // =========================================================
  // LOGOUT
  // POST /api/v1/auth/logout
  // =========================================================

  logout(
    refreshToken: string
  ): Observable<void> {

    return this.http.post<void>(
      `${environment.apiBaseUrl}/auth/logout`,
      {
        refreshToken
      }
    );
  }
}
