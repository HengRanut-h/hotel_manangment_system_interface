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
  SpinComponent
} from '../../../../../shared/ui/spin/spin.component';

import {
  ToastService
} from '../../../../../shared/ui/toast/toast.service';

import {
  InventoryItemFormComponent
} from '../../components/inventory-item-form/inventory-item-form.component';

import {
  InventoryItemsApiService
} from '../../data-access/inventory-items-api.service';

import {
  CreateInventoryItemRequest
} from '../../models/inventory-item.model';

@Component({
  selector:
    'app-inventory-item-create-page',

  standalone:
    true,

  imports: [
    TranslationPipe,
    SpinComponent,
    InventoryItemFormComponent
  ],

  templateUrl:
    './inventory-item-create.page.html',

  styleUrl:
    './inventory-item-create.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class InventoryItemCreatePage {

  private readonly api =
    inject(InventoryItemsApiService);

  private readonly router =
    inject(Router);

  private readonly toast =
    inject(ToastService);

  private readonly translation =
    inject(TranslationService);

  readonly submitting =
    signal(false);

  submit(
    request: CreateInventoryItemRequest
  ): void {

    if (
      this.submitting()
    ) {
      return;
    }

    this.submitting.set(true);

    this.api
      .create(request)
      .subscribe({

        next:
          () => {

            this.submitting.set(false);

            this.toast.success(
              this.translation.translate(
                'inventoryItems.createSuccess'
              )
            );

            void this.router.navigate([
              '/app/inventory/items'
            ]);
          },

        error:
          error => {

            this.submitting.set(false);

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'inventoryItems.createFailed'
                )
              )
            );
          }
      });
  }

  cancel(): void {

    if (
      this.submitting()
    ) {
      return;
    }

    void this.router.navigate([
      '/app/inventory/items'
    ]);
  }
}
