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
  ComplaintFormComponent,
  ComplaintFormValue
} from '../../components/complaint-form/complaint-form.component';

import {
  ComplaintsApiService
} from '../../data-access/complaints-api.service';

@Component({
  selector:
    'app-complaints-create-page',

  standalone:
    true,

  imports: [
    TranslationPipe,
    ComplaintFormComponent
  ],

  templateUrl:
    './complaints-create.page.html',

  styleUrl:
    './complaints-create.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class ComplaintsCreatePage {

  private readonly api =
    inject(ComplaintsApiService);

  private readonly router =
    inject(Router);

  private readonly toast =
    inject(ToastService);

  private readonly translation =
    inject(TranslationService);

  readonly submitting =
    signal(false);

  submit(
    value: ComplaintFormValue
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
                'complaints.createSuccess'
              )
            );

            void this.router.navigate([
              '/app/operations/complaints',
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
                  'complaints.createFailed'
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
      '/app/operations/complaints'
    ]);
  }
}
