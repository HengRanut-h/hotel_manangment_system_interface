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
  RoleFormComponent
} from '../../components/role-form/role-form.component';

import {
  RoleApiService
} from '../../data-access/role-api.service';

@Component({
  selector: 'app-role-edit-page',
  standalone: true,
  imports: [
    TranslationPipe,
    PageHeaderComponent,
    SpinComponent,
    RoleFormComponent,
    LucideRefreshCw
  ],
  templateUrl: './role-edit.page.html',
  styleUrl: './role-edit.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleEditPage implements OnInit {
  private readonly api = inject(RoleApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly translation = inject(TranslationService);

  readonly id = signal('');
  readonly name = signal('');
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly errorMessage = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage.set(
        this.translation.translate('roles.missingId')
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

    this.api.getById(this.id()).subscribe({
      next: role => {
        this.name.set(role.name);
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

  save(): void {
    const name = this.name().trim();

    if (!name || this.saving()) {
      return;
    }

    this.saving.set(true);

    this.api.update(this.id(), { name }).subscribe({
      next: () => {
        this.toast.success(
          this.translation.translate('roles.updateSuccess')
        );

        void this.router.navigate([
          '/app/admin/roles',
          this.id()
        ]);
      },

      error: error => {
        this.toast.error(
          getSafeApiErrorMessage(
            error,
            this.translation.translate('roles.updateFailed')
          )
        );
        this.saving.set(false);
      }
    });
  }

  cancel(): void {
    void this.router.navigate([
      '/app/admin/roles',
      this.id()
    ]);
  }
}
