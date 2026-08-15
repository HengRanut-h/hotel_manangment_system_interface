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
  WarehouseFormComponent,
  WarehouseFormValue
} from '../../components/warehouse-form/warehouse-form.component';

import {
  WarehousesApiService
} from '../../data-access/warehouses-api.service';

@Component({
  selector:
    'app-warehouse-create-page',

  standalone:
    true,

  imports: [
    TranslationPipe,
    WarehouseFormComponent
  ],

  templateUrl:
    './warehouse-create.page.html',

  styleUrl:
    './warehouse-create.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class WarehouseCreatePage {

  private readonly api =
    inject(WarehousesApiService);

  private readonly router =
    inject(Router);

  private readonly toast =
    inject(ToastService);

  private readonly translation =
    inject(TranslationService);

  readonly submitting =
    signal(false);

  submit(
    value: WarehouseFormValue
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
                'warehouses.createSuccess'
              )
            );

            void this.router.navigate([
              '/app/inventory/warehouses'
            ]);
          },

        error:
          error => {

            this.submitting.set(false);

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'warehouses.createFailed'
                )
              )
            );
          }
      });
  }

  cancel(): void {

    void this.router.navigate([
      '/app/inventory/warehouses'
    ]);
  }
}
