import {
  HttpErrorResponse,
  HttpInterceptorFn
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
  AuthStore
} from '../auth/auth.store';

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

  // =========================================================
  // AUTH ENDPOINT
  // =========================================================

  const isAuthEndpoint =
    request.url.includes(
      '/auth/'
    );

  // =========================================================
  // ACCESS TOKEN
  // =========================================================

  const accessToken =
    auth.accessToken();

  const authorizedRequest =
    !isAuthEndpoint &&
    accessToken
      ? request.clone({
          setHeaders: {
            Authorization:
              `Bearer ${accessToken}`
          }
        })
      : request;

  // =========================================================
  // SEND REQUEST
  // =========================================================

  return next(
    authorizedRequest
  )
    .pipe(
      catchError(
        error => {

          const unauthorized =
            error instanceof
              HttpErrorResponse &&
            error.status === 401;

          if (
            !unauthorized ||
            isAuthEndpoint
          ) {

            return throwError(
              () => error
            );
          }

          // =================================================
          // TRY REFRESH TOKEN
          // =================================================

          return auth
            .refreshSession()
            .pipe(
              switchMap(
                newAccessToken => {

                  if (
                    !newAccessToken
                  ) {

                    auth.logout();

                    return throwError(
                      () => error
                    );
                  }

                  // =========================================
                  // RETRY ORIGINAL REQUEST
                  // =========================================

                  const retryRequest =
                    request.clone({
                      setHeaders: {
                        Authorization:
                          `Bearer ${newAccessToken}`
                      }
                    });

                  return next(
                    retryRequest
                  );
                }
              )
            );
        }
      )
    );
};
