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
  LucidePencil,
  LucideRefreshCw,
  LucideShield,
  LucideShieldCheck,
  LucideTrash2,
  LucideUsers
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
} from '../../data-access/role-api.service';

import {
  Role
} from '../../models/role.model';

@Component({
  selector: 'app-role-detail-page',
  standalone: true,
  imports: [
    RouterLink,
    TranslationPipe,
    SpinComponent,
    LucideArrowLeft,
    LucidePencil,
    LucideRefreshCw,
    LucideShield,
    LucideShieldCheck,
    LucideTrash2,
    LucideUsers
  ],
  templateUrl: './role-detail.page.html',
  styleUrl: './role-detail.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(RoleApiService);
  private readonly toast = inject(ToastService);
  private readonly translation = inject(TranslationService);

  readonly role = signal<Role | null>(null);
  readonly loading = signal(true);
  readonly deleting = signal(false);
  readonly errorMessage = signal('');

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage.set(
        this.translation.translate('roles.missingId')
      );
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.api.getById(id).subscribe({
      next: response => {
        this.role.set({
          id: response.id,
          name: response.name,
          permissions: Array.isArray(response.permissions)
            ? response.permissions
            : [],
          userCount: Number(response.userCount ?? 0)
        });
        this.loading.set(false);
      },

      error: error => {
        this.errorMessage.set(
          getSafeApiErrorMessage(
            error,
            this.translation.translate('roles.loadFailed')
          )
        );
        this.loading.set(false);
      }
    });
  }

  back(): void {
    void this.router.navigate(['/app/admin/roles']);
  }

  remove(): void {
    const currentRole = this.role();

    if (!currentRole || this.deleting()) {
      return;
    }

    if (currentRole.userCount > 0) {
      this.toast.error(
        this.translation.translate('roles.deleteAssignedError')
      );
      return;
    }

    const confirmed = window.confirm(
      this.translation.translate(
        'roles.deleteConfirm',
        { name: currentRole.name }
      )
    );

    if (!confirmed) {
      return;
    }

    this.deleting.set(true);

    this.api.delete(currentRole.id).subscribe({
      next: () => {
        this.toast.success(
          this.translation.translate('roles.deleteSuccess')
        );
        void this.router.navigate(['/app/admin/roles']);
      },

      error: error => {
        this.deleting.set(false);
        this.toast.error(
          getSafeApiErrorMessage(
            error,
            this.translation.translate('roles.deleteFailed')
          )
        );
      }
    });
  }
}
