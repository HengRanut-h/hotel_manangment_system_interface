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
  PurchaseOrderFormComponent,
  PurchaseOrderFormValue
} from '../../components/purchase-order-form/purchase-order-form.component';

import {
  PurchaseOrdersApiService
} from '../../data-access/purchase-orders-api.service';

@Component({
  selector:
    'app-purchase-orders-create-page',

  standalone:
    true,

  imports: [
    TranslationPipe,
    PurchaseOrderFormComponent
  ],

  templateUrl:
    './purchase-orders-create.page.html',

  styleUrl:
    './purchase-orders-create.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class PurchaseOrdersCreatePage {

  private readonly api =
    inject(PurchaseOrdersApiService);

  private readonly router =
    inject(Router);

  private readonly toast =
    inject(ToastService);

  private readonly translation =
    inject(TranslationService);

  readonly submitting =
    signal(false);

  submit(
    value: PurchaseOrderFormValue
  ): void {

    if (this.submitting()) {
      return;
    }

    this.submitting.set(true);

    this.api
      .create({
        branchId:
          value.branchId,

        referenceNumber:
          value.referenceNumber,

        title:
          value.title,

        notes:
          value.notes,

        amount:
          value.amount,

        eventAtUtc:
          value.eventAtUtc,

        relatedEntityId:
          value.relatedEntityId,

        relatedEntityType:
          value.relatedEntityType
      })
      .subscribe({

        next:
          () => {

            this.submitting.set(false);

            this.toast.success(
              this.translation.translate(
                'purchaseOrders.createSuccess'
              )
            );

            void this.router.navigate([
              '/app/inventory/purchase-orders'
            ]);
          },

        error:
          error => {

            this.submitting.set(false);

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'purchaseOrders.createFailed'
                )
              )
            );
          }
      });
  }

  cancel(): void {

    if (this.submitting()) {
      return;
    }

    void this.router.navigate([
      '/app/inventory/purchase-orders'
    ]);
  }
}
