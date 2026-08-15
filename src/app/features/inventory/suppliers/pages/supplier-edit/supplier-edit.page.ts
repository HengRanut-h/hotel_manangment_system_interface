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
  SupplierFormComponent,
  SupplierFormValue
} from '../../components/supplier-form/supplier-form.component';

import {
  SuppliersApiService
} from '../../data-access/suppliers-api.service';

import {
  Supplier
} from '../../models/supplier.model';

@Component({
  selector:
    'app-supplier-edit-page',

  standalone:
    true,

  imports: [
    TranslationPipe,
    SpinComponent,
    SupplierFormComponent
  ],

  templateUrl:
    './supplier-edit.page.html',

  styleUrl:
    './supplier-edit.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class SupplierEditPage
  implements OnInit {

  private readonly api =
    inject(SuppliersApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly toast =
    inject(ToastService);

  private readonly translation =
    inject(TranslationService);

  readonly supplier =
    signal<Supplier | null>(null);

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
        '/app/inventory/suppliers'
      ]);
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.api
      .getById(id)
      .subscribe({

        next:
          supplier => {

            this.supplier.set(
              supplier
            );

            this.loading.set(false);
          },

        error:
          error => {

            this.errorMessage.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'suppliers.editLoadFailed'
                )
              )
            );

            this.loading.set(false);
          }
      });
  }

  submit(
    value: SupplierFormValue
  ): void {

    const supplier =
      this.supplier();

    if (
      !supplier
      ||
      this.submitting()
    ) {
      return;
    }

    this.submitting.set(true);

    this.api
      .update(
        supplier.id,
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
                'suppliers.updateSuccess'
              )
            );

            void this.router.navigate([
              '/app/inventory/suppliers',
              supplier.id
            ]);
          },

        error:
          error => {

            this.submitting.set(false);

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'suppliers.updateFailed'
                )
              )
            );
          }
      });
  }

  cancel(): void {

    const supplier =
      this.supplier();

    void this.router.navigate(
      supplier
        ? [
            '/app/inventory/suppliers',
            supplier.id
          ]
        : [
            '/app/inventory/suppliers'
          ]
    );
  }
}
