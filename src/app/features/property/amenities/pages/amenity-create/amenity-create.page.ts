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
  AmenityFormComponent,
  AmenityFormValue
} from '../../components/amenity-form/amenity-form.component';

import {
  AmenityApiService
} from '../../data-access/amenity-api.service';

@Component({
  selector: 'app-amenity-create-page',
  standalone: true,
  imports: [
    RouterLink,
    TranslationPipe,
    AmenityFormComponent,
    LucideArrowLeft
  ],
  templateUrl: './amenity-create.page.html',
  styleUrl: './amenity-create.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AmenityCreatePage {

  private readonly api =
    inject(
      AmenityApiService
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
    value: AmenityFormValue
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
          amenity => {

            this.toast.success(
              this.translation.translate(
                'amenities.createSuccess'
              )
            );

            void this.router.navigate([
              '/app/property/amenities',
              amenity.id
            ]);
          },
        error:
          error => {

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'amenities.createFailed'
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
      '/app/property/amenities'
    ]);
  }

}
