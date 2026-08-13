import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
  LucideBuilding2,
  LucideEye,
  LucideEyeOff,
  LucideKeyRound,
  LucideLockKeyhole,
  LucideMail,
  LucideShieldCheck,
  LucideUserRound
} from '@lucide/angular';

import {
  AuthStore
} from '../../../../core/auth/auth.store';

import {
  ToastService
} from '../../../../shared/ui/toast/toast.service';

@Component({
  selector: 'app-register-page',

  standalone: true,

  imports: [
    FormsModule,
    RouterLink,
    LucideBuilding2,
    LucideEye,
    LucideEyeOff,
    LucideKeyRound,
    LucideLockKeyhole,
    LucideMail,
    LucideShieldCheck,
    LucideUserRound
  ],

  templateUrl:
    './register.page.html',

  styleUrl:
    './register.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class RegisterPage {

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

  readonly fullName =
    signal('');

  readonly hotelName =
    signal('');

  readonly email =
    signal('');

  readonly currency =
    signal('USD');

  readonly password =
    signal('');

  readonly confirmPassword =
    signal('');

  readonly showPassword =
    signal(false);

  readonly showConfirmPassword =
    signal(false);

  // =========================================================
  // PASSWORD MISMATCH
  // =========================================================

  readonly passwordMismatch =
    computed(
      () =>
        this.confirmPassword().length > 0 &&
        this.password() !==
        this.confirmPassword()
    );

  // =========================================================
  // CAN SUBMIT
  // =========================================================

  readonly canSubmit =
    computed(
      () =>
        this.fullName()
          .trim()
          .length >= 2 &&

        this.hotelName()
          .trim()
          .length >= 2 &&

        this.email()
          .trim()
          .length > 0 &&

        this.password()
          .length >= 8 &&

        this.confirmPassword()
          .length >= 8 &&

        !this.passwordMismatch() &&

        !this.auth.loading()
    );

  // =========================================================
  // FULL NAME
  // =========================================================

  setFullName(
    event: Event
  ): void {

    this.fullName.set(
      (
        event.target as
          HTMLInputElement
      ).value
    );
  }

  // =========================================================
  // HOTEL NAME
  // =========================================================

  setHotelName(
    event: Event
  ): void {

    this.hotelName.set(
      (
        event.target as
          HTMLInputElement
      ).value
    );
  }

  // =========================================================
  // EMAIL
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
  // CURRENCY
  // =========================================================

  setCurrency(
    event: Event
  ): void {

    this.currency.set(
      (
        event.target as
          HTMLSelectElement
      ).value
    );
  }

  // =========================================================
  // PASSWORD
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
  // CONFIRM PASSWORD
  // =========================================================

  setConfirmPassword(
    event: Event
  ): void {

    this.confirmPassword.set(
      (
        event.target as
          HTMLInputElement
      ).value
    );
  }

  // =========================================================
  // SHOW PASSWORD
  // =========================================================

  togglePassword(): void {

    this.showPassword.update(
      value =>
        !value
    );
  }

  // =========================================================
  // SHOW CONFIRM PASSWORD
  // =========================================================

  toggleConfirmPassword(): void {

    this.showConfirmPassword.update(
      value =>
        !value
    );
  }

  // =========================================================
  // REGISTER
  // =========================================================

  submit(): void {

    if (
      !this.canSubmit()
    ) {

      if (
        this.passwordMismatch()
      ) {
        this.toast.error(
          'Password and confirm password do not match.'
        );
      }

      return;
    }

    this.auth
      .register({
        fullName:
          this.fullName()
            .trim(),

        hotelName:
          this.hotelName()
            .trim(),

        email:
          this.email()
            .trim()
            .toLowerCase(),

        currency:
          this.currency(),

        password:
          this.password(),

        confirmPassword:
          this.confirmPassword()
      })
      .subscribe({
        next: () => {

          this.toast.success(
            'Account created successfully.'
          );

          void this.router.navigateByUrl(
            this.auth.defaultRoute()
          );
        },

        error: () => {

          this.toast.error(
            'Unable to create account. Please check your information.'
          );
        }
      });
  }
}
