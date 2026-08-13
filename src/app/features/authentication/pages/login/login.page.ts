import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  LucideEye,
  LucideEyeOff,
  LucideKeyRound,
  LucideLockKeyhole,
  LucideMail
} from '@lucide/angular';

import {
  AuthStore
} from '../../../../core/auth/auth.store';

import {
  ToastService
} from '../../../../shared/ui/toast/toast.service';

@Component({
  selector: 'app-login-page',

  standalone: true,

  imports: [
    FormsModule,
    RouterLink,
    LucideEye,
    LucideEyeOff,
    LucideKeyRound,
    LucideLockKeyhole,
    LucideMail
  ],

  templateUrl:
    './login.page.html',

  styleUrl:
    './login.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class LoginPage {

  readonly auth =
    inject(
      AuthStore
    );

  private readonly router =
    inject(
      Router
    );

  private readonly toast =
    inject(
      ToastService
    );

  readonly email =
    signal(
      'admin@hotel.local'
    );

  readonly password =
    signal(
      'ChangeMe123!'
    );

  readonly show =
    signal(
      false
    );

  // =========================================================
  // SET EMAIL
  // =========================================================

  setEmail(
    event: Event
  ): void {

    this.email.set(
      (
        event.target as
          HTMLInputElement
      ).value
    );
  }

  // =========================================================
  // SET PASSWORD
  // =========================================================

  setPassword(
    event: Event
  ): void {

    this.password.set(
      (
        event.target as
          HTMLInputElement
      ).value
    );
  }

  // =========================================================
  // SHOW / HIDE PASSWORD
  // =========================================================

  toggleShow(): void {

    this.show.update(
      value =>
        !value
    );
  }

  // =========================================================
  // LOGIN
  // =========================================================

  submit(): void {

    const email =
      this.email()
        .trim();

    const password =
      this.password();

    if (
      !email ||
      !password ||
      this.auth.loading()
    ) {
      return;
    }

    this.auth
      .login({
        email,
        password
      })
      .subscribe({
        next: () => {

          void this.router
            .navigateByUrl(
              this.auth.defaultRoute()
            );
        },

        error: error => {

          const message =
            error?.message ??
            error?.error?.message ??
            'Unable to sign in. Check your email and password.';

          this.toast.error(
            message
          );
        }
      });
  }
}
