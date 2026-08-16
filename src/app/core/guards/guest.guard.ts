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

export const guestGuard:
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
    return router.createUrlTree(
      [
        auth.defaultRoute()
      ]
    );
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
            ? router.createUrlTree(
                [
                  auth.defaultRoute()
                ]
              )
            : true
        )
      );
  }

  return true;
};
