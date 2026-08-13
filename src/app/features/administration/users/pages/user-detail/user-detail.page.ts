import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import {
  LucideArrowLeft,
  LucideKeyRound,
  LucideMail,
  LucideMapPin,
  LucidePencil,
  LucideRefreshCw,
  LucideShieldCheck,
  LucideTrash2,
  LucideUserCheck,
  LucideUsers,
  LucideUserX
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
  SpinComponent
} from '../../../../../shared/ui/spin/spin.component';

import {
  ToastService
} from '../../../../../shared/ui/toast/toast.service';

import {
  UserApiService
} from '../../data-access/user-api.service';

import {
  User
} from '../../models/user.model';

@Component({
  selector: 'app-user-detail-page',
  standalone: true,

  imports: [
    RouterLink,
    TranslationPipe,
    SpinComponent,

    LucideArrowLeft,
    LucideKeyRound,
    LucideMail,
    LucideMapPin,
    LucidePencil,
    LucideRefreshCw,
    LucideShieldCheck,
    LucideTrash2,
    LucideUserCheck,
    LucideUsers,
    LucideUserX
  ],

  templateUrl: './user-detail.page.html',
  styleUrl: './user-detail.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class UserDetailPage
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

  readonly user =
    signal<User | null>(null);

  readonly loading =
    signal(true);

  readonly actionLoading =
    signal(false);

  readonly errorMessage =
    signal('');

  ngOnInit(): void {
    this.load();
  }

  load(): void {

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

    this.loading.set(true);
    this.errorMessage.set('');

    this.api
      .getById(id)
      .subscribe({
        next: user => {

          this.user.set(user);
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

  back(): void {

    void this.router.navigate([
      '/app/admin/users'
    ]);
  }

  toggleStatus(): void {

    const current =
      this.user();

    if (
      !current
      ||
      this.actionLoading()
    ) {
      return;
    }

    this.actionLoading.set(true);

    const request =
      current.isActive
        ? this.api.disable(current.id)
        : this.api.enable(current.id);

    request.subscribe({
      next: () => {

        this.actionLoading.set(false);

        this.user.update(user =>
          user
            ? {
                ...user,
                isActive:
                  !user.isActive
              }
            : user
        );

        this.toast.success(
          this.translation.translate(
            current.isActive
              ? 'users.disableSuccess'
              : 'users.enableSuccess'
          )
        );
      },

      error: error => {

        this.actionLoading.set(false);

        this.toast.error(
          getSafeApiErrorMessage(
            error,
            this.translation.translate(
              current.isActive
                ? 'users.disableFailed'
                : 'users.enableFailed'
            )
          )
        );
      }
    });
  }

  remove(): void {

    const current =
      this.user();

    if (
      !current
      ||
      this.actionLoading()
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        this.translation.translate(
          'users.deleteConfirm',
          {
            name:
              current.fullName
          }
        )
      );

    if (!confirmed) {
      return;
    }

    this.actionLoading.set(true);

    this.api
      .delete(current.id)
      .subscribe({
        next: () => {

          this.toast.success(
            this.translation.translate(
              'users.deleteSuccess'
            )
          );

          void this.router.navigate([
            '/app/admin/users'
          ]);
        },

        error: error => {

          this.actionLoading.set(false);

          this.toast.error(
            getSafeApiErrorMessage(
              error,
              this.translation.translate(
                'users.deleteFailed'
              )
            )
          );
        }
      });
  }
}
