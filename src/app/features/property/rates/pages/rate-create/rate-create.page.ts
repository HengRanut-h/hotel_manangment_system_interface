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
  RateFormComponent,
  RateFormValue
} from '../../components/rate-form/rate-form.component';

import {
  RateApiService
} from '../../data-access/rate-api.service';

@Component({
  selector: 'app-rate-create.page',
  standalone: true,
  imports: [
    RouterLink,
    TranslationPipe,
    RateFormComponent,
    LucideArrowLeft
  ],
  templateUrl: './rate-create.page.html',
  styleUrl: './rate-create.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RateCreatePage {

  private readonly api =
    inject(
      RateApiService
    );

  private readonly router =
    inject(
      Router
    );

  private readonly toast =
    inject(
      ToastService
    );

  private readonly translation =
    inject(
      TranslationService
    );

  readonly saving =
    signal(
      false
    );

  save(
    value: RateFormValue
  ): void {

    if (
      this.saving()
    ) {
      return;
    }

    this.saving.set(
      true
    );

    this.api
      .create({
        name:
          value.name,
        code:
          value.code,
        description:
          value.description
      })
      .subscribe({
        next:
          rate => {

            this.toast.success(
              this.translation.translate(
                'rates.createSuccess'
              )
            );

            void this.router.navigate([
              '/app/property/rates',
              rate.id
            ]);
          },
        error:
          error => {

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'rates.createFailed'
                )
              )
            );

            this.saving.set(
              false
            );
          }
      });
  }

  cancel(): void {

    void this.router.navigate([
      '/app/property/rates'
    ]);
  }

}
