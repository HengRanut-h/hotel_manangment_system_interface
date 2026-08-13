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
  PermissionFormComponent,
  PermissionFormValue
} from '../../components/permission-form/permission-form.component';

import {
  PermissionApiService
} from '../../data-access/permission-api.service';

@Component({
  selector: 'app-permission-edit-page',
  standalone: true,
  imports: [
    TranslationPipe,
    PageHeaderComponent,
    SpinComponent,
    PermissionFormComponent,
    LucideRefreshCw
  ],
  templateUrl: './permission-edit.page.html',
  styleUrl: './permission-edit.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionEditPage implements OnInit {
  private readonly api = inject(PermissionApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly translation = inject(TranslationService);

  readonly permissionId = signal('');
  readonly permissionName = signal('');
  readonly loading = signal(true);
  readonly submitting = signal(false);
  readonly errorMessage = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage.set(
        this.translation.translate('permissions.missingId')
      );
      this.loading.set(false);
      return;
    }

    this.permissionId.set(id);
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.api.getById(this.permissionId()).subscribe({
      next: permission => {
        this.permissionName.set(permission.name);
        this.loading.set(false);
      },

      error: error => {
        this.errorMessage.set(
          getSafeApiErrorMessage(
            error,
            this.translation.translate('permissions.loadOneFailed')
          )
        );
        this.loading.set(false);
      }
    });
  }

  submit(request: PermissionFormValue): void {
    if (this.submitting()) {
      return;
    }

    this.submitting.set(true);

    this.api.update(
      this.permissionId(),
      { name: request.name }
    ).subscribe({
      next: () => {
        this.toast.success(
          this.translation.translate('permissions.updateSuccess')
        );
        void this.router.navigate(['/app/admin/permissions']);
      },

      error: error => {
        this.toast.error(
          getSafeApiErrorMessage(
            error,
            this.translation.translate('permissions.updateFailed')
          )
        );
        this.submitting.set(false);
      }
    });
  }

  cancel(): void {
    void this.router.navigate(['/app/admin/permissions']);
  }
}
