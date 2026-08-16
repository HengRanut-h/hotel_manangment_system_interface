import {
  inject
} from '@angular/core';

import {
  CanActivateFn,
  Router
} from '@angular/router';

import {
  map
} from 'rxjs';

import {
  AuthStore
} from '../auth/auth.store';

export const authGuard:
  CanActivateFn =
() => {

  const auth =
    inject(
      AuthStore
    );

  const router =
    inject(
      Router
    );

  if (
    auth.authenticated() &&
    !auth.isAccessTokenExpired()
  ) {
    return true;
  }

  if (
    auth.authenticated() &&
    auth.isAccessTokenExpired() &&
    !auth.isRefreshTokenExpired()
  ) {
    return auth
      .refreshSession()
      .pipe(
        map(token =>
          token
            ? true
            : router.createUrlTree(
                [
                  '/auth/login'
                ]
              )
        )
      );
  }

  auth.clearSession();

  return router.createUrlTree(
    [
      '/auth/login'
    ]
  );
};
