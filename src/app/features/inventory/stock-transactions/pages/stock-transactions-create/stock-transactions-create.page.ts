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
  StockTransactionFormComponent,
  StockTransactionFormValue
} from '../../components/stock-transaction-form/stock-transaction-form.component';

import {
  StockTransactionsApiService
} from '../../data-access/stock-transactions-api.service';

@Component({
  selector:
    'app-stock-transactions-create-page',

  standalone:
    true,

  imports: [
    TranslationPipe,
    StockTransactionFormComponent
  ],

  templateUrl:
    './stock-transactions-create.page.html',

  styleUrl:
    './stock-transactions-create.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class StockTransactionsCreatePage {

  private readonly api =
    inject(StockTransactionsApiService);

  private readonly router =
    inject(Router);

  private readonly toast =
    inject(ToastService);

  private readonly translation =
    inject(TranslationService);

  readonly submitting =
    signal(false);

  submit(
    value: StockTransactionFormValue
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
          item => {

            this.submitting.set(false);

            this.toast.success(
              this.translation.translate(
                'stockTransactions.createSuccess'
              )
            );

            void this.router.navigate([
              '/app/inventory/stock-transactions',
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
                  'stockTransactions.createFailed'
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
      '/app/inventory/stock-transactions'
    ]);
  }
}
