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
  WarehouseFormComponent,
  WarehouseFormValue
} from '../../components/warehouse-form/warehouse-form.component';

import {
  WarehousesApiService
} from '../../data-access/warehouses-api.service';

import {
  Warehouse
} from '../../models/warehouse.model';

@Component({
  selector:
    'app-warehouse-edit-page',

  standalone:
    true,

  imports: [
    TranslationPipe,
    SpinComponent,
    WarehouseFormComponent
  ],

  templateUrl:
    './warehouse-edit.page.html',

  styleUrl:
    './warehouse-edit.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class WarehouseEditPage
  implements OnInit {

  private readonly api =
    inject(WarehousesApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly toast =
    inject(ToastService);

  private readonly translation =
    inject(TranslationService);

  readonly warehouse =
    signal<Warehouse | null>(null);

  readonly loading =
    signal(true);

  readonly submitting =
    signal(false);

  readonly errorMessage =
    signal('');

  ngOnInit(): void {

    this.load();
  }

  load(): void {

    const id =
      this.route.snapshot
        .paramMap
        .get('id');

    if (!id) {
      void this.router.navigate([
        '/app/inventory/warehouses'
      ]);
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.api
      .getById(id)
      .subscribe({

        next:
          warehouse => {

            this.warehouse.set(
              warehouse
            );

            this.loading.set(false);
          },

        error:
          error => {

            this.errorMessage.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'warehouses.editLoadFailed'
                )
              )
            );

            this.loading.set(false);
          }
      });
  }

  submit(
    value: WarehouseFormValue
  ): void {

    const warehouse =
      this.warehouse();

    if (
      !warehouse
      ||
      this.submitting()
    ) {
      return;
    }

    this.submitting.set(true);

    this.api
      .update(
        warehouse.id,
        {
          branchId:
            value.branchId,
          name:
            value.name,
          code:
            value.code,
          description:
            value.description,
          isActive:
            value.isActive
        }
      )
      .subscribe({

        next:
          () => {

            this.submitting.set(false);

            this.toast.success(
              this.translation.translate(
                'warehouses.updateSuccess'
              )
            );

            void this.router.navigate([
              '/app/inventory/warehouses',
              warehouse.id
            ]);
          },

        error:
          error => {

            this.submitting.set(false);

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'warehouses.updateFailed'
                )
              )
            );
          }
      });
  }

  cancel(): void {

    const warehouse =
      this.warehouse();

    void this.router.navigate(
      warehouse
        ? [
            '/app/inventory/warehouses',
            warehouse.id
          ]
        : [
            '/app/inventory/warehouses'
          ]
    );
  }
}
