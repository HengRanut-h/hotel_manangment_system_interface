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
  forkJoin
} from 'rxjs';

import {
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
  UserFormComponent
} from '../../components/user-form/user-form.component';

import {
  UserApiService
} from '../../data-access/user-api.service';

@Component({
  selector: 'app-user-edit-page',
  standalone: true,

  imports: [
    TranslationPipe,
    PageHeaderComponent,
    SpinComponent,
    UserFormComponent,

    LucideRefreshCw
  ],

  templateUrl: './user-edit.page.html',
  styleUrl: './user-edit.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class UserEditPage
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

  readonly id = signal('');
  readonly fullName = signal('');
  readonly email = signal('');
  readonly branchId = signal<string | null>(null);
  readonly isActive = signal(true);
  readonly roleNames = signal<string[]>([]);
  readonly availableRoles = signal<string[]>([]);

  readonly loading = signal(true);
  readonly saving = signal(false);
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

    forkJoin({
      user:
        this.api.getById(this.id()),

      roles:
        this.roleApi.getAll()
    })
      .subscribe({
        next: response => {

          this.fullName.set(
            response.user.fullName
          );

          this.email.set(
            response.user.email
          );

          this.branchId.set(
            response.user.branchId
          );

          this.isActive.set(
            response.user.isActive
          );

          this.roleNames.set(
            [...response.user.roles]
          );

          this.availableRoles.set(
            response.roles
              .map(role => role.name)
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

  save(): void {

    if (this.saving()) {
      return;
    }

    this.saving.set(true);

    this.api
      .update(
        this.id(),
        {
          fullName:
            this.fullName().trim(),

          email:
            this.email().trim().toLowerCase(),

          branchId:
            this.branchId()?.trim()
            ||
            null,

          isActive:
            this.isActive(),

          roleNames:
            this.roleNames()
        }
      )
      .subscribe({
        next: () => {

          this.toast.success(
            this.translation.translate(
              'users.updateSuccess'
            )
          );

          void this.router.navigate([
            '/app/admin/users',
            this.id()
          ]);
        },

        error: error => {

          this.toast.error(
            getSafeApiErrorMessage(
              error,
              this.translation.translate(
                'users.updateFailed'
              )
            )
          );

          this.saving.set(false);
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
