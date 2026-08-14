import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal
} from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  LucideArrowLeft
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
  ToastService
} from '../../../../../shared/ui/toast/toast.service';

import {
  DepartmentFormComponent,
  DepartmentFormValue
} from '../../components/department-form/department-form.component';

import {
  DepartmentApiService
} from '../../data-access/department-api.service';

@Component({
  selector: 'app-department-create.page',
  standalone: true,
  imports: [
    RouterLink,
    TranslationPipe,
    DepartmentFormComponent,
    LucideArrowLeft
  ],
  templateUrl: './department-create.page.html',
  styleUrl: './department-create.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartmentCreatePage {

  private readonly api =
    inject(
      DepartmentApiService
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

  readonly saving =
    signal(
      false
    );

  save(
    value: DepartmentFormValue
  ): void {

    if (
      this.saving()
    ) {
      return;
    }

    this.saving.set(
      true
    );

    this.api
      .create({
        name:
          value.name,
        code:
          value.code,
        description:
          value.description,
        branchId:
          value.branchId
      })
      .subscribe({
        next:
          department => {

            this.toast.success(
              this.translation.translate(
                'departments.createSuccess'
              )
            );

            void this.router.navigate([
              '/app/hr/departments',
              department.id
            ]);
          },
        error:
          error => {

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'departments.createFailed'
                )
              )
            );

            this.saving.set(
              false
            );
          }
      });
  }

  cancel(): void {

    void this.router.navigate([
      '/app/hr/departments'
    ]);
  }

}
