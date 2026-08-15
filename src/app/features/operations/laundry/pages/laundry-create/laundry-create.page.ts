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
  LaundryFormComponent,
  LaundryFormValue
} from '../../components/laundry-form/laundry-form.component';

import {
  LaundryApiService
} from '../../data-access/laundry-api.service';

@Component({
  selector:
    'app-laundry-create-page',

  standalone:
    true,

  imports: [
    TranslationPipe,
    LaundryFormComponent
  ],

  templateUrl:
    './laundry-create.page.html',

  styleUrl:
    './laundry-create.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class LaundryCreatePage {

  private readonly api =
    inject(LaundryApiService);

  private readonly router =
    inject(Router);

  private readonly toast =
    inject(ToastService);

  private readonly translation =
    inject(TranslationService);

  readonly submitting =
    signal(false);

  submit(
    value: LaundryFormValue
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
                'laundry.createSuccess'
              )
            );

            void this.router.navigate([
              '/app/operations/laundry',
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
                  'laundry.createFailed'
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
      '/app/operations/laundry'
    ]);
  }
}
