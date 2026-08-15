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
  PurchaseRequestFormComponent,
  PurchaseRequestFormValue
} from '../../components/purchase-request-form/purchase-request-form.component';

import {
  PurchaseRequestsApiService
} from '../../data-access/purchase-requests-api.service';

@Component({
  selector:
    'app-purchase-requests-create-page',

  standalone:
    true,

  imports: [
    TranslationPipe,
    PurchaseRequestFormComponent
  ],

  templateUrl:
    './purchase-requests-create.page.html',

  styleUrl:
    './purchase-requests-create.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class PurchaseRequestsCreatePage {

  private readonly api =
    inject(PurchaseRequestsApiService);

  private readonly router =
    inject(Router);

  private readonly toast =
    inject(ToastService);

  private readonly translation =
    inject(TranslationService);

  readonly submitting =
    signal(false);

  submit(
    value: PurchaseRequestFormValue
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
                'purchaseRequests.createSuccess'
              )
            );

            void this.router.navigate([
              '/app/inventory/purchase-requests'
            ]);
          },

        error:
          error => {

            this.submitting.set(false);

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'purchaseRequests.createFailed'
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
      '/app/inventory/purchase-requests'
    ]);
  }
}
