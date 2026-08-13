import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  LucideEye,
  LucideEyeOff,
  LucideKeyRound,
  LucideRefreshCw
} from '@lucide/angular';

import {
  getSafeApiErrorMessage
} from '../../../../../core/http/api-error.util';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  TranslationService
} from '../../../../../core/i18n/translation.service';

import {
  PageHeaderComponent
} from '../../../../../shared/ui/page-header/page-header.component';

import {
  SpinComponent
} from '../../../../../shared/ui/spin/spin.component';

import {
  ToastService
} from '../../../../../shared/ui/toast/toast.service';

import {
  UserApiService
} from '../../data-access/user-api.service';

@Component({
  selector: 'app-user-reset-password-page',
  standalone: true,

  imports: [
    TranslationPipe,
    PageHeaderComponent,
    SpinComponent,

    LucideEye,
    LucideEyeOff,
    LucideKeyRound,
    LucideRefreshCw
  ],

  templateUrl: './user-reset-password.page.html',
  styleUrl: './user-reset-password.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class UserResetPasswordPage
  implements OnInit {

  private readonly api =
    inject(UserApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly toast =
    inject(ToastService);

  private readonly translation =
    inject(TranslationService);

  readonly id = signal('');
  readonly userName = signal('');
  readonly password = signal('');
  readonly confirmPassword = signal('');

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly showPassword = signal(false);
  readonly errorMessage = signal('');

  ngOnInit(): void {

    const id =
      this.route.snapshot
        .paramMap
        .get('id');

    if (!id) {

      this.errorMessage.set(
        this.translation.translate(
          'users.missingId'
        )
      );

      this.loading.set(false);

      return;
    }

    this.id.set(id);

    this.load();
  }

  load(): void {

    this.loading.set(true);
    this.errorMessage.set('');

    this.api
      .getById(this.id())
      .subscribe({
        next: user => {

          this.userName.set(
            user.fullName
          );

          this.loading.set(false);
        },

        error: error => {

          this.errorMessage.set(
            getSafeApiErrorMessage(
              error,
              this.translation.translate(
                'users.loadOneFailed'
              )
            )
          );

          this.loading.set(false);
        }
      });
  }

  setPassword(
    event: Event
  ): void {

    this.password.set(
      (event.target as HTMLInputElement).value
    );
  }

  setConfirmPassword(
    event: Event
  ): void {

    this.confirmPassword.set(
      (event.target as HTMLInputElement).value
    );
  }

  save(): void {

    if (
      this.saving()
      ||
      this.password().length < 8
      ||
      this.password() !==
      this.confirmPassword()
    ) {
      return;
    }

    this.saving.set(true);

    this.api
      .resetPassword(
        this.id(),
        {
          password:
            this.password()
        }
      )
      .subscribe({
        next: () => {

          this.toast.success(
            this.translation.translate(
              'users.resetPasswordSuccess'
            )
          );

          void this.router.navigate([
            '/app/admin/users',
            this.id()
          ]);
        },

        error: error => {

          this.saving.set(false);

          this.toast.error(
            getSafeApiErrorMessage(
              error,
              this.translation.translate(
                'users.resetPasswordFailed'
              )
            )
          );
        }
      });
  }

  cancel(): void {

    void this.router.navigate([
      '/app/admin/users',
      this.id()
    ]);
  }
}
