import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import {
  getSafeApiErrorMessage
} from '../../../../../core/http/api-error.util';

import {
  SpinComponent
} from '../../../../../shared/ui/spin/spin.component';

import {
  ToastService
} from '../../../../../shared/ui/toast/toast.service';

import {
  HotelFormComponent,
  HotelFormValue
} from '../../components/hotel-form/hotel-form.component';

import {
  HotelApiService
} from '../../data-access/hotel-api.service';

import {
  Hotel
} from '../../models/hotel.model';

import {
  LucideArrowLeft
} from '@lucide/angular';
import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';
@Component({
  selector: 'app-hotel-edit-page',
  standalone: true,
imports: [
  RouterLink,
  SpinComponent,
  HotelFormComponent,
  TranslationPipe,
  LucideArrowLeft
],
  templateUrl: './hotel-edit.page.html',
  styleUrl: './hotel-edit.page.css',
  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class HotelEditPage
  implements OnInit {

  private readonly api =
    inject(HotelApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly toast =
    inject(ToastService);

  readonly hotel =
    signal<Hotel | null>(null);

  readonly loading =
    signal(true);

  readonly saving =
    signal(false);

  readonly error =
    signal('');

  ngOnInit(): void {
    this.load();
  }

  load(): void {

    const id =
      this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('Hotel ID is missing.');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.api
      .getById(id)
      .subscribe({
        next: hotel => {
          this.hotel.set(hotel);
          this.loading.set(false);
        },

        error: error => {
          this.error.set(
            getSafeApiErrorMessage(
              error,
              'Unable to load hotel.'
            )
          );
          this.loading.set(false);
        }
      });
  }

  save(
    value: HotelFormValue
  ): void {

    const hotel =
      this.hotel();

    if (
      !hotel
      ||
      this.saving()
    ) {
      return;
    }

    this.saving.set(true);

    this.api
      .update(
        hotel.id,
        {
          name: value.name,
          code: value.code,
          currency: value.currency,
          isActive: value.isActive
        }
      )
      .subscribe({
        next: updated => {
          this.toast.success(
            'Hotel updated successfully.'
          );

          void this.router.navigate([
            '/app/property/hotels',
            updated.id
          ]);
        },

        error: error => {
          this.toast.error(
            getSafeApiErrorMessage(
              error,
              'Unable to update hotel.'
            )
          );

          this.saving.set(false);
        }
      });
  }

  cancel(): void {

    const hotel =
      this.hotel();

    void this.router.navigate(
      hotel
        ? ['/app/property/hotels', hotel.id]
        : ['/app/property/hotels']
    );
  }
}
