import {
  computed,
  inject,
  Injectable,
  signal
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  catchError,
  finalize,
  map,
  Observable,
  of,
  tap
} from 'rxjs';

import {
  AuthApiService
} from './auth-api.service';

import {
  AuthResponse,
  LoginRequest,
  RegisterRequest
} from './auth.models';

import {
  TokenStorageService
} from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthStore {

  private readonly storage =
    inject(
      TokenStorageService
    );

  private readonly api =
    inject(
      AuthApiService
    );

  private readonly router =
    inject(
      Router
    );

  private readonly session =
    signal<AuthResponse | null>(
      this.storage.read()
    );

  readonly loading =
    signal(false);

  readonly user =
    computed(
      () =>
        this.session()?.user ??
        null
    );

  readonly accessToken =
    computed(
      () =>
        this.session()?.accessToken ??
        null
    );

  readonly refreshToken =
    computed(
      () =>
        this.session()?.refreshToken ??
        null
    );

  readonly authenticated =
    computed(
      () =>
        !!this.session()?.accessToken &&
        !!this.session()?.user
    );

  readonly displayName =
    computed(
      () =>
        this.user()?.fullName ||
        this.user()?.email ||
        'User'
    );

  // =========================================================
  // REGISTER
  // =========================================================

  register(
    request: RegisterRequest
  ): Observable<boolean> {

    this.loading.set(
      true
    );

    return this.api
      .register(
        request
      )
      .pipe(
        tap(session =>
          this.setSession(
            session
          )
        ),

        map(
          () => true
        ),

        finalize(
          () =>
            this.loading.set(
              false
            )
        )
      );
  }

  // =========================================================
  // LOGIN
  // =========================================================

  login(
    request: LoginRequest
  ): Observable<boolean> {

    this.loading.set(
      true
    );

    return this.api
      .login(
        request
      )
      .pipe(
        tap(session =>
          this.setSession(
            session
          )
        ),

        map(
          () => true
        ),

        finalize(
          () =>
            this.loading.set(
              false
            )
        )
      );
  }

  // =========================================================
  // REFRESH SESSION
  // =========================================================

  refreshSession():
    Observable<string | null> {

    const token =
      this.refreshToken();

    if (!token) {

      return of(
        null
      );
    }

    return this.api
      .refresh(
        token
      )
      .pipe(
        tap(session =>
          this.setSession(
            session
          )
        ),

        map(session =>
          session.accessToken
        ),

        catchError(
          () => {

            this.clearSession();

            return of(
              null
            );
          }
        )
      );
  }

  // =========================================================
  // LOGOUT
  // =========================================================

  logout(): void {

    const token =
      this.refreshToken();

    this.clearSession();

    void this.router.navigate(
      [
        '/auth/login'
      ]
    );

    if (token) {

      this.api
        .logout(
          token
        )
        .subscribe({
          error:
            () =>
              undefined
        });
    }
  }

  // =========================================================
  // HAS ROLE
  // =========================================================

  hasRole(
    ...roles: string[]
  ): boolean {

    const currentRoles =
      new Set(
        (
          this.user()?.roles ??
          []
        )
          .map(role =>
            role.toLowerCase()
          )
      );

    return roles.some(
      role =>
        currentRoles.has(
          role.toLowerCase()
        )
    );
  }

  // =========================================================
  // HAS PERMISSION
  // =========================================================

  hasPermission(
    permission: string
  ): boolean {

    if (
      this.hasRole(
        'SuperAdmin',
        'Super Admin'
      )
    ) {
      return true;
    }

    const currentPermissions =
      new Set(
        (
          this.user()?.permissions ??
          []
        )
          .map(item =>
            item.toLowerCase()
          )
      );

    return currentPermissions.has(
      permission.toLowerCase()
    );
  }

  // =========================================================
  // DEFAULT ROUTE
  // =========================================================

  defaultRoute(): string {

    if (
      this.hasRole(
        'Guest'
      )
    ) {
      return '/guest/dashboard';
    }

    return '/app/dashboard';
  }

  // =========================================================
  // SET SESSION
  // =========================================================

  private setSession(
    value: AuthResponse
  ): void {

    this.session.set(
      value
    );

    this.storage.write(
      value
    );
  }

  // =========================================================
  // CLEAR SESSION
  // =========================================================

  private clearSession(): void {

    this.session.set(
      null
    );

    this.storage.clear();
  }
}
