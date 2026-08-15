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
  GoodsReceiptFormComponent,
  GoodsReceiptFormValue
} from '../../components/goods-receipt-form/goods-receipt-form.component';

import {
  GoodsReceiptsApiService
} from '../../data-access/goods-receipts-api.service';

@Component({
  selector:
    'app-goods-receipts-create-page',

  standalone:
    true,

  imports: [
    TranslationPipe,
    GoodsReceiptFormComponent
  ],

  templateUrl:
    './goods-receipts-create.page.html',

  styleUrl:
    './goods-receipts-create.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class GoodsReceiptsCreatePage {

  private readonly api =
    inject(GoodsReceiptsApiService);

  private readonly router =
    inject(Router);

  private readonly toast =
    inject(ToastService);

  private readonly translation =
    inject(TranslationService);

  readonly submitting =
    signal(false);

  submit(
    value: GoodsReceiptFormValue
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
                'goodsReceipts.createSuccess'
              )
            );

            void this.router.navigate([
              '/app/inventory/goods-receipts'
            ]);
          },

        error:
          error => {

            this.submitting.set(false);

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'goodsReceipts.createFailed'
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
      '/app/inventory/goods-receipts'
    ]);
  }
}
