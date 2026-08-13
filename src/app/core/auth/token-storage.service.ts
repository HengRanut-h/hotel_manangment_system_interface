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

  read(): AuthResponse | null {

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

  // =========================================================
  // WRITE
  // =========================================================

  write(
    value: AuthResponse
  ): void {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        value
      )
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
      typeof session.refreshToken !== 'string' ||
      !session.refreshToken
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
}
