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
  RoomTypeFormComponent,
  RoomTypeFormValue
} from '../../components/room-type-form/room-type-form.component';

import {
  RoomTypeApiService
} from '../../data-access/room-type-api.service';

@Component({
  selector: 'app-room-type-create-page',
  standalone: true,
  imports: [
    RouterLink,
    TranslationPipe,
    RoomTypeFormComponent,
    LucideArrowLeft
  ],
  templateUrl: './room-type-create.page.html',
  styleUrl: './room-type-create.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomTypeCreatePage {

  private readonly api =
    inject(
      RoomTypeApiService
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
    value: RoomTypeFormValue
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
        baseRate:
          value.baseRate,
        maxAdults:
          value.maxAdults,
        maxChildren:
          value.maxChildren,
        description:
          value.description,
        isActive:
          value.isActive
      })
      .subscribe({
        next:
          roomType => {

            this.toast.success(
              this.translation.translate(
                'roomTypes.createSuccess'
              )
            );

            void this.router.navigate([
              '/app/property/room-types',
              roomType.id
            ]);
          },
        error:
          error => {

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'roomTypes.createFailed'
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
      '/app/property/room-types'
    ]);
  }

}
