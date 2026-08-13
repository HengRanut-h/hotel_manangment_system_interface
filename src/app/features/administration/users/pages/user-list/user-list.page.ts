import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  LucideCirclePlus,
  LucideEye,
  LucideKeyRound,
  LucidePencil,
  LucideRefreshCw,
  LucideSearch,
  LucideShieldCheck,
  LucideTrash2,
  LucideUserCheck,
  LucideUsers,
  LucideUserX,
  LucideX
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

import {
  User
} from '../../models/user.model';

@Component({
  selector: 'app-user-list-page',
  standalone: true,

  imports: [
    RouterLink,
    TranslationPipe,
    PageHeaderComponent,
    SpinComponent,

    LucideCirclePlus,
    LucideEye,
    LucideKeyRound,
    LucidePencil,
    LucideRefreshCw,
    LucideSearch,
    LucideShieldCheck,
    LucideTrash2,
    LucideUserCheck,
    LucideUsers,
    LucideUserX,
    LucideX
  ],

  templateUrl: './user-list.page.html',
  styleUrl: './user-list.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class UserListPage
  implements OnInit {

  private readonly api =
    inject(UserApiService);

  private readonly router =
    inject(Router);

  private readonly toast =
    inject(ToastService);

  private readonly translation =
    inject(TranslationService);

  readonly users =
    signal<User[]>([]);

  readonly search =
    signal('');

  readonly loading =
    signal(true);

  readonly errorMessage =
    signal('');

  readonly actionUserId =
    signal<string | null>(null);

  readonly filteredUsers =
    computed(() => {

      const term =
        this.search()
          .trim()
          .toLowerCase();

      if (!term) {
        return this.users();
      }

      return this.users()
        .filter(user => {

          const roles =
            Array.isArray(user.roles)
              ? user.roles
              : [];

          return (
            user.fullName
              .toLowerCase()
              .includes(term)
            ||
            user.email
              .toLowerCase()
              .includes(term)
            ||
            roles.some(role =>
              role
                .toLowerCase()
                .includes(term)
            )
          );
        });
    });

  readonly activeCount =
    computed(() =>
      this.users()
        .filter(user =>
          user.isActive
        )
        .length
    );

  readonly inactiveCount =
    computed(() =>
      this.users().length
      -
      this.activeCount()
    );

  ngOnInit(): void {
    this.load();
  }

  load(): void {

    this.loading.set(true);
    this.errorMessage.set('');

    this.api
      .getAll()
      .subscribe({
        next: users => {

          this.users.set(
            Array.isArray(users)
              ? users
              : []
          );

          this.loading.set(false);
        },

        error: error => {

          this.users.set([]);

          this.errorMessage.set(
            getSafeApiErrorMessage(
              error,
              this.translation.translate(
                'users.loadFailed'
              )
            )
          );

          this.loading.set(false);
        }
      });
  }

  setSearch(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;

    this.search.set(input.value);
  }

  clearSearch(): void {
    this.search.set('');
  }

  createUser(): void {

    void this.router.navigate([
      '/app/admin/users/create'
    ]);
  }

  toggleStatus(
    user: User
  ): void {

    if (this.actionUserId()) {
      return;
    }

    this.actionUserId.set(user.id);

    const request =
      user.isActive
        ? this.api.disable(user.id)
        : this.api.enable(user.id);

    request.subscribe({
      next: () => {

        this.actionUserId.set(null);

        this.users.update(current =>
          current.map(item =>
            item.id === user.id
              ? {
                  ...item,
                  isActive:
                    !item.isActive
                }
              : item
          )
        );

        this.toast.success(
          this.translation.translate(
            user.isActive
              ? 'users.disableSuccess'
              : 'users.enableSuccess'
          )
        );
      },

      error: error => {

        this.actionUserId.set(null);

        this.toast.error(
          getSafeApiErrorMessage(
            error,
            this.translation.translate(
              user.isActive
                ? 'users.disableFailed'
                : 'users.enableFailed'
            )
          )
        );
      }
    });
  }

  remove(
    user: User
  ): void {

    if (this.actionUserId()) {
      return;
    }

    const confirmed =
      window.confirm(
        this.translation.translate(
          'users.deleteConfirm',
          {
            name: user.fullName
          }
        )
      );

    if (!confirmed) {
      return;
    }

    this.actionUserId.set(user.id);

    this.api
      .delete(user.id)
      .subscribe({
        next: () => {

          this.actionUserId.set(null);

          this.users.update(current =>
            current.filter(item =>
              item.id !== user.id
            )
          );

          this.toast.success(
            this.translation.translate(
              'users.deleteSuccess'
            )
          );
        },

        error: error => {

          this.actionUserId.set(null);

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
