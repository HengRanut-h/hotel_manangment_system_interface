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
  LostAndFoundFormComponent,
  LostAndFoundFormValue
} from '../../components/lost-and-found-form/lost-and-found-form.component';

import {
  LostAndFoundApiService
} from '../../data-access/lost-and-found-api.service';

@Component({
  selector:
    'app-lost-and-found-create-page',

  standalone:
    true,

  imports: [
    TranslationPipe,
    LostAndFoundFormComponent
  ],

  templateUrl:
    './lost-and-found-create.page.html',

  styleUrl:
    './lost-and-found-create.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class LostAndFoundCreatePage {

  private readonly api =
    inject(LostAndFoundApiService);

  private readonly router =
    inject(Router);

  private readonly toast =
    inject(ToastService);

  private readonly translation =
    inject(TranslationService);

  readonly submitting =
    signal(false);

  submit(
    value: LostAndFoundFormValue
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
                'lostAndFound.createSuccess'
              )
            );

            void this.router.navigate([
              '/app/operations/lost-and-found',
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
                  'lostAndFound.createFailed'
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
      '/app/operations/lost-and-found'
    ]);
  }
}
