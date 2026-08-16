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
  StayExtensionFormComponent,
  StayExtensionFormValue
} from '../../components/stay-extension-form/stay-extension-form.component';

import {
  StayExtensionsApiService
} from '../../data-access/stay-extensions-api.service';

@Component({
  selector:
    'app-stay-extensions-create-page',

  standalone:
    true,

  imports: [
    TranslationPipe,
    StayExtensionFormComponent
  ],

  templateUrl:
    './stay-extensions-create.page.html',

  styleUrl:
    './stay-extensions-create.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class StayExtensionsCreatePage {

  private readonly api =
    inject(StayExtensionsApiService);

  private readonly router =
    inject(Router);

  private readonly toast =
    inject(ToastService);

  private readonly translation =
    inject(TranslationService);

  readonly submitting =
    signal(false);

  submit(
    value: StayExtensionFormValue
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
                'stayExtensions.createSuccess'
              )
            );

            void this.router.navigate([
              '/app/front-office/stay-extensions'
            ]);
          },

        error:
          error => {

            this.submitting.set(false);

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'stayExtensions.createFailed'
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
      '/app/front-office/stay-extensions'
    ]);
  }
}
