import {
  computed,
  inject,
  Injectable,
  OnDestroy,
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
  shareReplay,
  tap
} from 'rxjs';

import {
  environment
} from '../../../environments/environment';

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
export class AuthStore implements OnDestroy {

  private static readonly refreshSkewMs =
    60_000;

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
      null
    );

  private refreshTimer:
    ReturnType<typeof setTimeout> |
    null =
      null;

  private refreshRequest$:
    Observable<AuthResponse | null> |
    null =
      null;

  private readonly resumeHandler =
    () =>
      this.checkSessionAfterResume();

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

  readonly accessTokenExpiresAtUtc =
    computed(
      () =>
        this.session()?.accessTokenExpiresAtUtc ??
        null
    );

  readonly refreshToken =
    computed(
      () =>
        this.session()?.refreshToken ??
        null
    );

  readonly refreshTokenExpiresAtUtc =
    computed(
      () =>
        this.session()?.refreshTokenExpiresAtUtc ??
        null
    );

  readonly authenticated =
    computed(
      () =>
        !!this.session()?.user &&
        !!this.session()?.accessToken &&
        !this.isRefreshTokenExpired()
    );

  readonly displayName =
    computed(
      () =>
        this.user()?.fullName ||
        this.user()?.email ||
        'User'
    );

  constructor() {

    this.restoreSession();

    if (
      typeof window !== 'undefined'
    ) {
      window.addEventListener(
        'focus',
        this.resumeHandler
      );
    }

    if (
      typeof document !== 'undefined'
    ) {
      document.addEventListener(
        'visibilitychange',
        this.resumeHandler
      );
    }
  }

  ngOnDestroy(): void {

    this.clearRefreshTimer();

    if (
      typeof window !== 'undefined'
    ) {
      window.removeEventListener(
        'focus',
        this.resumeHandler
      );
    }

    if (
      typeof document !== 'undefined'
    ) {
      document.removeEventListener(
        'visibilitychange',
        this.resumeHandler
      );
    }
  }

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

    if (
      this.isRefreshTokenExpired()
    ) {
      this.clearSession();

      return of(
        null
      );
    }

    const token =
      this.refreshToken();

    if (!token) {

      return of(
        null
      );
    }

    if (
      !this.refreshRequest$
    ) {
      this.debug(
        '[AUTH] Refresh token request started'
      );

      this.refreshRequest$ =
        this.api
          .refresh(
            token
          )
          .pipe(
            tap(session => {
              this.debug(
                '[AUTH] Refresh token succeeded'
              );

              this.setSession(
                session
              );
            }),

            catchError(
              () => {
                this.clearSession();

                void this.router.navigate(
                  [
                    '/auth/login'
                  ]
                );

                return of(
                  null
                );
              }
            ),

            finalize(
              () => {
                this.refreshRequest$ =
                  null;
              }
            ),

            shareReplay({
              bufferSize:
                1,

              refCount:
                false
            })
          );
    }

    return this.refreshRequest$
      .pipe(
        map(session =>
          session?.accessToken ??
          null
        )
      );
  }

  // =========================================================
  // LOGOUT
  // =========================================================

  logout(): void {

    const token =
      this.refreshToken();

    const finish =
      () => {
        this.clearSession();

        void this.router.navigate(
          [
            '/auth/login'
          ]
        );
      };

    if (!token) {
      finish();

      return;
    }

    this.api
      .logout(
        token
      )
      .pipe(
        finalize(
          finish
        )
      )
      .subscribe({
        error:
          () =>
            undefined
      });
  }

  // =========================================================
  // RESTORE SESSION
  // =========================================================

  restoreSession(): void {

    const session =
      this.storage.get();

    if (!session) {
      this.clearSession();

      return;
    }

    this.session.set(
      session
    );

    if (
      this.isRefreshTokenExpired()
    ) {
      this.clearSession();

      return;
    }

    if (
      this.isAccessTokenExpired()
    ) {
      this.refreshSession()
        .subscribe();

      return;
    }

    this.scheduleRefresh();
  }

  // =========================================================
  // TOKEN EXPIRY
  // =========================================================

  isAccessTokenExpired(): boolean {

    return this.isUtcExpired(
      this.accessTokenExpiresAtUtc()
    );
  }

  isRefreshTokenExpired(): boolean {

    return this.isUtcExpired(
      this.refreshTokenExpiresAtUtc()
    );
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
  // CLEAR SESSION
  // =========================================================

  clearSession(): void {

    this.clearRefreshTimer();

    this.refreshRequest$ =
      null;

    this.session.set(
      null
    );

    this.storage.clear();
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

    this.storage.save(
      value
    );

    this.scheduleRefresh();
  }

  // =========================================================
  // SCHEDULE REFRESH
  // =========================================================

  private scheduleRefresh(): void {

    this.clearRefreshTimer();

    if (
      this.isRefreshTokenExpired()
    ) {
      this.clearSession();

      return;
    }

    const accessTokenExpiresAtUtc =
      this.accessTokenExpiresAtUtc();

    if (!accessTokenExpiresAtUtc) {
      return;
    }

    const expiresAt =
      new Date(
        accessTokenExpiresAtUtc
      )
        .getTime();

    const refreshIn =
      expiresAt -
      Date.now() -
      AuthStore.refreshSkewMs;

    this.debug(
      '[AUTH] Access expires:',
      accessTokenExpiresAtUtc
    );

    this.debug(
      '[AUTH] Refresh scheduled in ms:',
      refreshIn
    );

    if (
      refreshIn > 0
    ) {
      this.refreshTimer =
        setTimeout(
          () =>
            this.refreshSession()
              .subscribe(),
          refreshIn
        );

      this.debug(
        '[AUTH] Next refresh scheduled'
      );

      return;
    }

    this.refreshSession()
      .subscribe();
  }

  private clearRefreshTimer(): void {

    if (
      this.refreshTimer
    ) {
      clearTimeout(
        this.refreshTimer
      );

      this.refreshTimer =
        null;
    }
  }

  private checkSessionAfterResume(): void {

    if (
      typeof document !== 'undefined' &&
      document.visibilityState === 'hidden'
    ) {
      return;
    }

    if (
      !this.session()
    ) {
      this.restoreSession();

      return;
    }

    if (
      this.isRefreshTokenExpired()
    ) {
      this.clearSession();

      void this.router.navigate(
        [
          '/auth/login'
        ]
      );

      return;
    }

    if (
      this.isAccessTokenExpired()
    ) {
      this.refreshSession()
        .subscribe();

      return;
    }

    this.scheduleRefresh();
  }

  private isUtcExpired(
    value: string | null
  ): boolean {

    if (!value) {
      return true;
    }

    const time =
      new Date(
        value
      )
        .getTime();

    if (
      Number.isNaN(
        time
      )
    ) {
      return true;
    }

    return time <=
      Date.now();
  }

  private debug(
    ...messages: unknown[]
  ): void {

    if (
      !environment.production
    ) {
      console.log(
        ...messages
      );
    }
  }
}
