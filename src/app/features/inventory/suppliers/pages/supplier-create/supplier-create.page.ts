import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal
} from '@angular/core';

import {
  Router
} from '@angular/router';

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
  SupplierFormComponent,
  SupplierFormValue
} from '../../components/supplier-form/supplier-form.component';

import {
  SuppliersApiService
} from '../../data-access/suppliers-api.service';

@Component({
  selector:
    'app-supplier-create-page',

  standalone:
    true,

  imports: [
    TranslationPipe,
    SupplierFormComponent
  ],

  templateUrl:
    './supplier-create.page.html',

  styleUrl:
    './supplier-create.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class SupplierCreatePage {

  private readonly api =
    inject(SuppliersApiService);

  private readonly router =
    inject(Router);

  private readonly toast =
    inject(ToastService);

  private readonly translation =
    inject(TranslationService);

  readonly submitting =
    signal(false);

  submit(
    value: SupplierFormValue
  ): void {

    if (
      this.submitting()
    ) {
      return;
    }

    this.submitting.set(true);

    this.api
      .create({
        branchId:
          value.branchId,
        name:
          value.name,
        code:
          value.code,
        description:
          value.description
      })
      .subscribe({

        next:
          () => {

            this.submitting.set(false);

            this.toast.success(
              this.translation.translate(
                'suppliers.createSuccess'
              )
            );

            void this.router.navigate([
              '/app/inventory/suppliers'
            ]);
          },

        error:
          error => {

            this.submitting.set(false);

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'suppliers.createFailed'
                )
              )
            );
          }
      });
  }

  cancel(): void {

    void this.router.navigate([
      '/app/inventory/suppliers'
    ]);
  }
}
