import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { getSafeApiErrorMessage } from '../../../../../core/http/api-error.util';
import { TranslationPipe } from '../../../../../core/i18n/translation.pipe';
import { TranslationService } from '../../../../../core/i18n/translation.service';
import { PageHeaderComponent } from '../../../../../shared/ui/page-header/page-header.component';
import { ToastService } from '../../../../../shared/ui/toast/toast.service';
import { RoleFormComponent } from '../../components/role-form/role-form.component';
import { RoleApiService } from '../../data-access/role-api.service';

@Component({
  selector: 'app-role-create-page',
  standalone: true,
  imports: [TranslationPipe, PageHeaderComponent, RoleFormComponent],
  templateUrl: './role-create.page.html',
  styleUrl: './role-create.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleCreatePage {
  private readonly api = inject(RoleApiService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly translation = inject(TranslationService);

  readonly name = signal('');
  readonly saving = signal(false);

  save(): void {
    const name = this.name().trim();

    if (!name || this.saving()) {
      return;
    }

    this.saving.set(true);

    this.api.create({ name }).subscribe({
      next: role => {
        this.toast.success(
          this.translation.translate('roles.createSuccess')
        );

        void this.router.navigate([
          '/app/admin/roles',
          role.id
        ]);
      },

      error: error => {
        this.toast.error(
          getSafeApiErrorMessage(
            error,
            this.translation.translate('roles.createFailed')
          )
        );
        this.saving.set(false);
      }
    });
  }

  cancel(): void {
    void this.router.navigate(['/app/admin/roles']);
  }
}
