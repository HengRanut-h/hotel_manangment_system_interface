import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal
} from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  LucideArrowLeft
} from '@lucide/angular';

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
  GuestServiceFormComponent,
  GuestServiceFormValue
} from '../../components/guest-service-form/guest-service-form.component';

import {
  GuestServicesApiService
} from '../../data-access/guest-services-api.service';

@Component({
  selector:
    'app-guest-services-create-page',

  standalone:
    true,

  imports: [
    RouterLink,
    TranslationPipe,
    GuestServiceFormComponent,
    LucideArrowLeft
  ],

  templateUrl:
    './guest-services-create.page.html',

  styleUrl:
    './guest-services-create.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class GuestServicesCreatePage {

  private readonly api =
    inject(GuestServicesApiService);

  private readonly router =
    inject(Router);

  private readonly toast =
    inject(ToastService);

  private readonly translation =
    inject(TranslationService);

  readonly submitting =
    signal(false);

  save(
    value: GuestServiceFormValue
  ): void {

    if (this.submitting()) {
      return;
    }

    this.submitting.set(true);

    this.api
      .create({
        branchId:
          value.branchId,
        name:
          value.name,
        code:
          value.code,
        description:
          value.description
      })
      .subscribe({

        next:
          item => {

            this.submitting.set(false);

            this.toast.success(
              this.translation.translate(
                'guestServices.createSuccess'
              )
            );

            void this.router.navigate([
              '/app/operations/services',
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
                  'guestServices.createFailed'
                )
              )
            );
          }
      });
  }

  cancel(): void {
    void this.router.navigate([
      '/app/operations/services'
    ]);
  }
}
