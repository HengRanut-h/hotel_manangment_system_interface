import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  LucideCheck,
  LucideEye,
  LucideEyeOff,
  LucideLockKeyhole,
  LucideMail,
  LucideSearch,
  LucideShieldCheck,
  LucideUser,
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
  SpinComponent
} from '../../../../../shared/ui/spin/spin.component';

import {
  ToastService
} from '../../../../../shared/ui/toast/toast.service';

import {
  RoleApiService
} from '../../../roles/data-access/role-api.service';

import {
  UserApiService
} from '../../data-access/user-api.service';

@Component({
  selector:
    'app-user-create-page',

  standalone:
    true,

  imports: [
    TranslationPipe,
    SpinComponent,

    LucideCheck,
    LucideEye,
    LucideEyeOff,
    LucideLockKeyhole,
    LucideMail,
    LucideSearch,
    LucideShieldCheck,
    LucideUser,
    LucideX
  ],

  templateUrl:
    './user-create.page.html',

  styleUrl:
    './user-create.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class UserCreatePage
  implements OnInit {

  // =========================================================
  // SERVICES
  // =========================================================

  private readonly api =
    inject(
      UserApiService
    );

  private readonly roleApi =
    inject(
      RoleApiService
    );

  private readonly router =
    inject(
      Router
    );

  private readonly toast =
    inject(
      ToastService
    );

  private readonly translation =
    inject(
      TranslationService
    );

  // =========================================================
  // FORM STATE
  // =========================================================

  readonly fullName =
    signal('');

  readonly email =
    signal('');

  readonly password =
    signal('');

  readonly roleNames =
    signal<string[]>([]);

  // =========================================================
  // ROLE STATE
  // =========================================================

  readonly roles =
    signal<string[]>([]);

  readonly roleSearch =
    signal('');

  readonly loadingRoles =
    signal(true);

  readonly roleLoadError =
    signal('');

  // =========================================================
  // UI STATE
  // =========================================================

  readonly saving =
    signal(false);

  readonly showPassword =
    signal(false);

  readonly submitted =
    signal(false);

  // =========================================================
  // FILTERED ROLES
  //
  // This screen is for Hotel Admin.
  //
  // SuperAdmin must never be assigned from this UI.
  //
  // Other roles are API driven:
  // - HotelAdmin
  // - Manager
  // - HRManager
  // - Receptionist
  // - Accountant
  // - Housekeeper
  // - etc.
  // =========================================================

  readonly availableRoles =
    computed(() => {

      const search =
        this.roleSearch()
          .trim()
          .toLowerCase();

      return this.roles()
        .filter(roleName =>
          !this.isSuperAdminRole(
            roleName
          )
        )
        .filter(roleName =>
          !search
          ||
          roleName
            .toLowerCase()
            .includes(search)
        );
    });

  // =========================================================
  // VALIDATION
  // =========================================================

  readonly fullNameValid =
    computed(() =>
      this.fullName()
        .trim()
        .length > 0
    );

  readonly emailValid =
    computed(() =>
      this.isValidEmail(
        this.email()
      )
    );

  readonly passwordValid =
    computed(() =>
      this.password()
        .length >= 8
    );

  readonly rolesValid =
    computed(() =>
      this.roleNames()
        .length > 0
    );

  readonly formValid =
    computed(() =>
      this.fullNameValid()
      &&
      this.emailValid()
      &&
      this.passwordValid()
      &&
      this.rolesValid()
    );

  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {
    this.loadRoles();
  }

  // =========================================================
  // LOAD ROLES
  // =========================================================

  loadRoles(): void {

    this.loadingRoles.set(
      true
    );

    this.roleLoadError.set(
      ''
    );

    this.roleApi
      .getAll()
      .subscribe({

        next: roles => {

          const names =
            roles
              .map(role =>
                role.name?.trim()
              )
              .filter(
                (
                  roleName
                ): roleName is string =>
                  Boolean(roleName)
              )
              .filter(roleName =>
                !this.isSuperAdminRole(
                  roleName
                )
              )
              .sort(
                (
                  first,
                  second
                ) =>
                  first.localeCompare(
                    second
                  )
              );

          this.roles.set(
            names
          );

          this.loadingRoles.set(
            false
          );
        },

        error: error => {

          this.roles.set(
            []
          );

          this.roleLoadError.set(
            getSafeApiErrorMessage(
              error,
              this.translation.translate(
                'users.rolesLoadFailed'
              )
            )
          );

          this.loadingRoles.set(
            false
          );
        }
      });
  }

  // =========================================================
  // INPUTS
  // =========================================================

  setFullName(
    event: Event
  ): void {

    const input =
      event.target as
        HTMLInputElement;

    this.fullName.set(
      input.value
    );
  }

  setEmail(
    event: Event
  ): void {

    const input =
      event.target as
        HTMLInputElement;

    this.email.set(
      input.value
    );
  }

  setPassword(
    event: Event
  ): void {

    const input =
      event.target as
        HTMLInputElement;

    this.password.set(
      input.value
    );
  }

  setRoleSearch(
    event: Event
  ): void {

    const input =
      event.target as
        HTMLInputElement;

    this.roleSearch.set(
      input.value
    );
  }

  // =========================================================
  // ROLES
  // =========================================================

  hasRole(
    roleName: string
  ): boolean {

    return this.roleNames()
      .includes(
        roleName
      );
  }

  toggleRole(
    roleName: string
  ): void {

    if (
      this.saving()
      ||
      this.isSuperAdminRole(
        roleName
      )
    ) {
      return;
    }

    this.roleNames.update(
      current =>
        current.includes(
          roleName
        )
          ? current.filter(
              currentRole =>
                currentRole !==
                roleName
            )
          : [
              ...current,
              roleName
            ]
    );
  }

  // =========================================================
  // PASSWORD VISIBILITY
  // =========================================================

  togglePassword(): void {

    if (this.saving()) {
      return;
    }

    this.showPassword.update(
      current =>
        !current
    );
  }

  // =========================================================
  // SAVE
  // =========================================================

  save(): void {

    this.submitted.set(
      true
    );

    if (
      this.saving()
      ||
      !this.formValid()
    ) {
      return;
    }

    this.saving.set(
      true
    );

    this.api
      .create({
        fullName:
          this.fullName()
            .trim(),

        email:
          this.email()
            .trim()
            .toLowerCase(),

        password:
          this.password(),

        roleNames:
          this.roleNames(),

        // Hotel Admin creates inside
        // current hotel/current branch.
        //
        // Backend:
        // request.BranchId ?? currentBranchId
        branchId:
          null
      })
      .subscribe({

        next: user => {

          this.toast.success(
            this.translation.translate(
              'users.createSuccess'
            )
          );

          void this.router.navigate([
            '/app/admin/users',
            user.id
          ]);
        },

        error: error => {

          this.saving.set(
            false
          );

          this.toast.error(
            getSafeApiErrorMessage(
              error,
              this.translation.translate(
                'users.createFailed'
              )
            )
          );
        }
      });
  }

  // =========================================================
  // CANCEL
  // =========================================================

  cancel(): void {

    if (this.saving()) {
      return;
    }

    void this.router.navigate([
      '/app/admin/users'
    ]);
  }

  // =========================================================
  // VALID EMAIL
  // =========================================================

  private isValidEmail(
    value: string
  ): boolean {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      .test(
        value.trim()
      );
  }

  // =========================================================
  // BLOCK SUPERADMIN
  // =========================================================

  private isSuperAdminRole(
    roleName: string
  ): boolean {

    const normalized =
      roleName
        .trim()
        .toLowerCase()
        .replace(
          /[\s_-]/g,
          ''
        );

    return normalized ===
      'superadmin';
  }
}
