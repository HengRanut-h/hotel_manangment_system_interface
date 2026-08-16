import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';

import {
  inject
} from '@angular/core';

import {
  catchError,
  switchMap,
  throwError
} from 'rxjs';

import {
  environment
} from '../../../environments/environment';

import {
  AuthStore
} from '../auth/auth.store';

const AUTH_ENDPOINTS = [
  `${environment.apiBaseUrl}/auth/login`,
  `${environment.apiBaseUrl}/auth/register`,
  `${environment.apiBaseUrl}/auth/refresh-token`,
  `${environment.apiBaseUrl}/auth/logout`
];

export const authInterceptor:
  HttpInterceptorFn =
(
  request,
  next
) => {

  const auth =
    inject(
      AuthStore
    );

  const isAuthEndpoint =
    isAuthenticationEndpoint(
      request.url
    );

  if (
    isAuthEndpoint
  ) {
    return next(
      request
    );
  }

  if (
    auth.accessToken() &&
    auth.isAccessTokenExpired() &&
    !auth.isRefreshTokenExpired()
  ) {
    return auth
      .refreshSession()
      .pipe(
        switchMap(
          newAccessToken =>
            next(
              withBearerToken(
                request,
                newAccessToken
              )
            )
        ),

        catchError(
          error =>
            throwError(
              () => error
            )
        )
      );
  }

  return next(
    withBearerToken(
      request,
      auth.accessToken()
    )
  )
    .pipe(
      catchError(
        error => {

          const unauthorized =
            error instanceof
              HttpErrorResponse &&
            error.status === 401;

          if (
            !unauthorized
          ) {
            return throwError(
              () => error
            );
          }

          if (
            auth.isRefreshTokenExpired()
          ) {
            auth.clearSession();

            return throwError(
              () => error
            );
          }

          return auth
            .refreshSession()
            .pipe(
              switchMap(
                newAccessToken => {

                  if (
                    !newAccessToken
                  ) {
                    return throwError(
                      () => error
                    );
                  }

                  return next(
                    withBearerToken(
                      request,
                      newAccessToken
                    )
                  );
                }
              )
            );
        }
      )
    );
};

function withBearerToken(
  request: HttpRequest<unknown>,
  accessToken: string | null
): HttpRequest<unknown> {

  if (!accessToken) {
    return request;
  }

  return request.clone({
    setHeaders: {
      Authorization:
        `Bearer ${accessToken}`
    }
  });
}

function isAuthenticationEndpoint(
  url: string
): boolean {

  return AUTH_ENDPOINTS.some(
    endpoint =>
      url.includes(
        endpoint
      )
  );
}
