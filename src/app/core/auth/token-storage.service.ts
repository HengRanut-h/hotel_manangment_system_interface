import {
  Injectable
} from '@angular/core';

import {
  AuthResponse
} from './auth.models';

const STORAGE_KEY =
  'hotel.auth';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  // =========================================================
  // READ
  // =========================================================

  get(): AuthResponse | null {

    try {

      const raw =
        localStorage.getItem(
          STORAGE_KEY
        );

      if (!raw) {
        return null;
      }

      const value =
        JSON.parse(
          raw
        ) as unknown;

      if (
        !this.isValidSession(
          value
        )
      ) {
        this.clear();

        return null;
      }

      return value;

    } catch {

      this.clear();

      return null;
    }
  }

  read(): AuthResponse | null {

    return this.get();
  }

  // =========================================================
  // WRITE
  // =========================================================

  save(
    value: AuthResponse
  ): void {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        value
      )
    );
  }

  write(
    value: AuthResponse
  ): void {

    this.save(
      value
    );
  }

  // =========================================================
  // CLEAR
  // =========================================================

  clear(): void {

    localStorage.removeItem(
      STORAGE_KEY
    );
  }

  // =========================================================
  // VALIDATE SESSION
  // =========================================================

  private isValidSession(
    value: unknown
  ): value is AuthResponse {

    if (
      value === null ||
      typeof value !== 'object'
    ) {
      return false;
    }

    const session =
      value as Partial<AuthResponse>;

    if (
      typeof session.accessToken !== 'string' ||
      !session.accessToken
    ) {
      return false;
    }

    if (
      typeof session.accessTokenExpiresAtUtc !== 'string' ||
      !this.isValidDate(
        session.accessTokenExpiresAtUtc
      )
    ) {
      return false;
    }

    if (
      typeof session.refreshToken !== 'string' ||
      !session.refreshToken
    ) {
      return false;
    }

    if (
      typeof session.refreshTokenExpiresAtUtc !== 'string' ||
      !this.isValidDate(
        session.refreshTokenExpiresAtUtc
      )
    ) {
      return false;
    }

    if (
      !session.user ||
      typeof session.user !== 'object'
    ) {
      return false;
    }

    return true;
  }

  private isValidDate(
    value: string
  ): boolean {

    return !Number.isNaN(
      new Date(
        value
      )
        .getTime()
    );
  }
}
