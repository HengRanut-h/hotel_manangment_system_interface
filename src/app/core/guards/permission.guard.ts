import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../auth/auth.store';

export const permissionGuard: CanActivateFn = route => {
  const auth = inject(AuthStore);
  const router = inject(Router);
  const permission = route.data['permission'] as string | undefined;
  return !permission || auth.hasPermission(permission) ? true : router.createUrlTree(['/app/forbidden']);
};
