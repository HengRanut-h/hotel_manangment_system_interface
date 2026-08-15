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
  GoodsReceiptFormComponent,
  GoodsReceiptFormValue
} from '../../components/goods-receipt-form/goods-receipt-form.component';

import {
  GoodsReceiptsApiService
} from '../../data-access/goods-receipts-api.service';

import {
  GoodsReceipt
} from '../../models/goods-receipt.model';

@Component({
  selector:
    'app-goods-receipts-edit-page',

  standalone:
    true,

  imports: [
    TranslationPipe,
    SpinComponent,
    GoodsReceiptFormComponent
  ],

  templateUrl:
    './goods-receipts-edit.page.html',

  styleUrl:
    './goods-receipts-edit.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class GoodsReceiptsEditPage
  implements OnInit {

  private readonly api =
    inject(GoodsReceiptsApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly toast =
    inject(ToastService);

  private readonly translation =
    inject(TranslationService);

  readonly item =
    signal<GoodsReceipt | null>(null);

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
      this.route.snapshot.paramMap
        .get('id');

    if (!id) {
      this.loading.set(false);

      this.errorMessage.set(
        this.translation.translate(
          'goodsReceipts.missingId'
        )
      );

      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.api
      .getById(id)
      .subscribe({

        next:
          item => {

            this.item.set(item);
            this.loading.set(false);
          },

        error:
          error => {

            this.errorMessage.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'goodsReceipts.loadOneFailed'
                )
              )
            );

            this.loading.set(false);
          }
      });
  }

  submit(
    value: GoodsReceiptFormValue
  ): void {

    const item =
      this.item();

    if (
      !item
      ||
      this.submitting()
    ) {
      return;
    }

    this.submitting.set(true);

    this.api
      .update(
        item.id,
        {
          branchId:
            value.branchId,

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
        }
      )
      .subscribe({

        next:
          () => {

            this.submitting.set(false);

            this.toast.success(
              this.translation.translate(
                'goodsReceipts.updateSuccess'
              )
            );

            void this.router.navigate([
              '/app/inventory/goods-receipts',
              item.id
            ]);
          },

        error:
          error => {

            this.submitting.set(false);

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'goodsReceipts.updateFailed'
                )
              )
            );
          }
      });
  }

  cancel(): void {

    const item =
      this.item();

    void this.router.navigate(
      item
        ? [
            '/app/inventory/goods-receipts',
            item.id
          ]
        : [
            '/app/inventory/goods-receipts'
          ]
    );
  }
}
