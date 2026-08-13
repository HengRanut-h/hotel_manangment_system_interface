import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { getSafeApiErrorMessage } from '../../../../../core/http/api-error.util';
import { TranslationPipe } from '../../../../../core/i18n/translation.pipe';
import { TranslationService } from '../../../../../core/i18n/translation.service';
import { PageHeaderComponent } from '../../../../../shared/ui/page-header/page-header.component';
import { ToastService } from '../../../../../shared/ui/toast/toast.service';
import {
  PermissionFormComponent,
  PermissionFormValue
} from '../../components/permission-form/permission-form.component';
import { PermissionApiService } from '../../data-access/permission-api.service';

@Component({
  selector: 'app-permission-create-page',
  standalone: true,
  imports: [
    TranslationPipe,
    PageHeaderComponent,
    PermissionFormComponent
  ],
  templateUrl: './permission-create.page.html',
  styleUrl: './permission-create.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionCreatePage {
  private readonly api = inject(PermissionApiService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly translation = inject(TranslationService);

  readonly submitting = signal(false);

  submit(request: PermissionFormValue): void {
    if (this.submitting()) {
      return;
    }

    this.submitting.set(true);

    this.api.create({ name: request.name }).subscribe({
      next: () => {
        this.toast.success(
          this.translation.translate('permissions.createSuccess')
        );
        void this.router.navigate(['/app/admin/permissions']);
      },

      error: error => {
        this.toast.error(
          getSafeApiErrorMessage(
            error,
            this.translation.translate('permissions.createFailed')
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
