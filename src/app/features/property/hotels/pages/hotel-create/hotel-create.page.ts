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
  getSafeApiErrorMessage
} from '../../../../../core/http/api-error.util';

import {
  ToastService
} from '../../../../../shared/ui/toast/toast.service';

import {
  HotelFormComponent,
  HotelFormValue
} from '../../components/hotel-form/hotel-form.component';
import {
  LucideArrowLeft
} from '@lucide/angular';
import {
  HotelApiService
} from '../../data-access/hotel-api.service';
import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  TranslationService
} from '../../../../../core/i18n/translation.service';


@Component({
  selector: 'app-hotel-create-page',
  standalone: true,
imports: [
  RouterLink,
  HotelFormComponent,
  TranslationPipe,
  LucideArrowLeft
],
  templateUrl: './hotel-create.page.html',
  styleUrl: './hotel-create.page.css',
  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class HotelCreatePage {

  private readonly api =
    inject(HotelApiService);

  private readonly router =
    inject(Router);

  private readonly toast =
    inject(ToastService);

  readonly saving =
    signal(false);

  save(
    value: HotelFormValue
  ): void {

    if (this.saving()) {
      return;
    }

    this.saving.set(true);

    this.api
      .create({
        name: value.name,
        code: value.code,
        currency: value.currency
      })
      .subscribe({
        next: hotel => {
          this.toast.success(
            'Hotel created successfully.'
          );

          void this.router.navigate([
            '/app/property/hotels',
            hotel.id
          ]);
        },

        error: error => {
          this.toast.error(
            getSafeApiErrorMessage(
              error,
              'Unable to create hotel.'
            )
          );

          this.saving.set(false);
        }
      });
  }

  cancel(): void {
    void this.router.navigate([
      '/app/property/hotels'
    ]);
  }
}
