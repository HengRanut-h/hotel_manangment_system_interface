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
  TransportationFormComponent,
  TransportationFormValue
} from '../../components/transportation-form/transportation-form.component';

import {
  TransportationApiService
} from '../../data-access/transportation-api.service';

@Component({
  selector:
    'app-transportation-create-page',

  standalone:
    true,

  imports: [
    TranslationPipe,
    TransportationFormComponent
  ],

  templateUrl:
    './transportation-create.page.html',

  styleUrl:
    './transportation-create.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class TransportationCreatePage {

  private readonly api =
    inject(TransportationApiService);

  private readonly router =
    inject(Router);

  private readonly toast =
    inject(ToastService);

  private readonly translation =
    inject(TranslationService);

  readonly submitting =
    signal(false);

  submit(
    value: TransportationFormValue
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
                'transportation.createSuccess'
              )
            );

            void this.router.navigate([
              '/app/operations/transportation',
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
                  'transportation.createFailed'
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
      '/app/operations/transportation'
    ]);
  }
}
