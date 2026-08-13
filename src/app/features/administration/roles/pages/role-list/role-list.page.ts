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
  LucidePencil,
  LucideRefreshCw,
  LucideSearch,
  LucideShield,
  LucideShieldCheck,
  LucideTrash2,
  LucideUsers,
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
  RoleApiService
} from '../../data-access/role-api.service';

import {
  Role
} from '../../models/role.model';

@Component({
  selector: 'app-role-list-page',
  standalone: true,

  imports: [
    RouterLink,
    TranslationPipe,
    PageHeaderComponent,
    SpinComponent,

    LucideCirclePlus,
    LucideEye,
    LucidePencil,
    LucideRefreshCw,
    LucideSearch,
    LucideShield,
    LucideShieldCheck,
    LucideTrash2,
    LucideUsers,
    LucideX
  ],

  templateUrl: './role-list.page.html',
  styleUrl: './role-list.page.css',

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleListPage
  implements OnInit {

  private readonly api =
    inject(RoleApiService);

  private readonly router =
    inject(Router);

  private readonly translation =
    inject(TranslationService);

  private readonly toast =
    inject(ToastService);

  readonly roles =
    signal<Role[]>([]);

  readonly search =
    signal('');

  readonly loading =
    signal(true);

  readonly errorMessage =
    signal('');

  readonly deletingId =
    signal<string | null>(null);

  readonly filteredRoles =
    computed(() => {

      const term =
        this.search()
          .trim()
          .toLowerCase();

      if (!term) {
        return this.roles();
      }

      return this.roles()
        .filter(
          role =>
            role.name
              .toLowerCase()
              .includes(term)
            ||
            role.permissions
              .some(
                permission =>
                  permission
                    .toLowerCase()
                    .includes(term)
              )
        );
    });

  readonly totalUsers =
    computed(() =>
      this.roles()
        .reduce(
          (total, role) =>
            total + role.userCount,
          0
        )
    );

  readonly totalPermissionAssignments =
    computed(() =>
      this.roles()
        .reduce(
          (total, role) =>
            total + role.permissions.length,
          0
        )
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

        next: roles => {

          this.roles.set(
            Array.isArray(roles)
              ? roles
              : []
          );

          this.loading.set(false);
        },

        error: error => {

          this.roles.set([]);

          this.errorMessage.set(
            getSafeApiErrorMessage(
              error,
              this.translation.translate(
                'roles.loadFailed'
              )
            )
          );

          this.loading.set(false);
        }
      });
  }

  createRole(): void {

    void this.router.navigate([
      '/app/admin/roles/create'
    ]);
  }

  setSearch(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;

    this.search.set(
      input.value
    );
  }

  clearSearch(): void {

    this.search.set('');
  }

  remove(
    role: Role
  ): void {

    if (this.deletingId()) {
      return;
    }

    if (role.userCount > 0) {

      this.toast.error(
        this.translation.translate(
          'roles.deleteAssignedError'
        )
      );

      return;
    }

    const confirmed =
      window.confirm(
        this.translation.translate(
          'roles.deleteConfirm',
          {
            name: role.name
          }
        )
      );

    if (!confirmed) {
      return;
    }

    this.deletingId.set(
      role.id
    );

    this.api
      .delete(role.id)
      .subscribe({

        next: () => {

          this.deletingId.set(null);

          this.roles.update(
            current =>
              current.filter(
                item =>
                  item.id !== role.id
              )
          );

          this.toast.success(
            this.translation.translate(
              'roles.deleteSuccess'
            )
          );
        },

        error: error => {

          this.deletingId.set(null);

          this.toast.error(
            getSafeApiErrorMessage(
              error,
              this.translation.translate(
                'roles.deleteFailed'
              )
            )
          );
        }
      });
  }
}
