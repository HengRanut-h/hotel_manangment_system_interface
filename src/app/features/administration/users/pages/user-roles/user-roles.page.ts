import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  forkJoin
} from 'rxjs';

import {
  LucideCheck,
  LucideRefreshCw,
  LucideSave,
  LucideSearch,
  LucideShieldCheck,
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
  RoleApiService
} from '../../../roles/data-access/role-api.service';

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
  selector: 'app-user-roles-page',
  standalone: true,

  imports: [
    TranslationPipe,
    PageHeaderComponent,
    SpinComponent,

    LucideCheck,
    LucideRefreshCw,
    LucideSave,
    LucideSearch,
    LucideShieldCheck,
    LucideX
  ],

  templateUrl: './user-roles.page.html',
  styleUrl: './user-roles.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class UserRolesPage
  implements OnInit {

  private readonly api =
    inject(UserApiService);

  private readonly roleApi =
    inject(RoleApiService);

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

  readonly roles =
    signal<string[]>([]);

  readonly selected =
    signal<string[]>([]);

  readonly search =
    signal('');

  readonly loading =
    signal(true);

  readonly saving =
    signal(false);

  readonly errorMessage =
    signal('');

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
        .filter(role =>
          role
            .toLowerCase()
            .includes(term)
        );
    });

  readonly backUrl =
    computed(() =>
      this.user()
        ? `/app/admin/users/${this.user()!.id}`
        : '/app/admin/users'
    );

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

    forkJoin({
      user:
        this.api.getById(id),

      roles:
        this.roleApi.getAll()
    })
      .subscribe({
        next: response => {

          this.user.set(
            response.user
          );

          this.roles.set(
            response.roles
              .map(role => role.name)
          );

          this.selected.set(
            [...response.user.roles]
          );

          this.loading.set(false);
        },

        error: error => {

          this.errorMessage.set(
            getSafeApiErrorMessage(
              error,
              this.translation.translate(
                'users.rolesLoadFailed'
              )
            )
          );

          this.loading.set(false);
        }
      });
  }

  hasRole(
    roleName: string
  ): boolean {

    return this.selected()
      .includes(roleName);
  }

  toggleRole(
    roleName: string
  ): void {

    if (this.saving()) {
      return;
    }

    this.selected.update(current =>
      current.includes(roleName)
        ? current.filter(item =>
            item !== roleName
          )
        : [...current, roleName]
    );
  }

  selectAll(): void {

    this.selected.set(
      [...this.roles()]
    );
  }

  clearAll(): void {
    this.selected.set([]);
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

  save(): void {

    const current =
      this.user();

    if (
      !current
      ||
      this.saving()
    ) {
      return;
    }

    this.saving.set(true);

    this.api
      .update(
        current.id,
        {
          fullName:
            current.fullName,

          email:
            current.email,

          branchId:
            current.branchId,

          isActive:
            current.isActive,

          roleNames:
            this.selected()
        }
      )
      .subscribe({
        next: () => {

          this.toast.success(
            this.translation.translate(
              'users.rolesSaveSuccess'
            )
          );

          void this.router.navigate([
            '/app/admin/users',
            current.id
          ]);
        },

        error: error => {

          this.saving.set(false);

          this.toast.error(
            getSafeApiErrorMessage(
              error,
              this.translation.translate(
                'users.rolesSaveFailed'
              )
            )
          );
        }
      });
  }

  cancel(): void {

    void this.router.navigateByUrl(
      this.backUrl()
    );
  }
}
