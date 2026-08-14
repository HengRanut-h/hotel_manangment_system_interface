import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
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
  SpinComponent
} from '../../../../../shared/ui/spin/spin.component';

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

import {
  RoomType
} from '../../models/room-type.model';

@Component({
  selector: 'app-room-type-edit-page',
  standalone: true,
  imports: [
    RouterLink,
    TranslationPipe,
    SpinComponent,
    RoomTypeFormComponent,
    LucideArrowLeft
  ],
  templateUrl: './room-type-edit.page.html',
  styleUrl: './room-type-edit.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomTypeEditPage
  implements OnInit {

  private readonly api =
    inject(
      RoomTypeApiService
    );

  private readonly route =
    inject(
      ActivatedRoute
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

  readonly roomType =
    signal<RoomType | null>(
      null
    );

  readonly loading =
    signal(
      true
    );

  readonly saving =
    signal(
      false
    );

  readonly error =
    signal(
      ''
    );

  ngOnInit(): void {

    this.load();
  }

  load(): void {

    const id =
      this.route
        .snapshot
        .paramMap
        .get(
          'id'
        );

    if (!id) {
      this.error.set(
        this.translation.translate(
          'roomTypes.missingId'
        )
      );
      this.loading.set(
        false
      );
      return;
    }

    this.loading.set(
      true
    );

    this.error.set(
      ''
    );

    this.api
      .getById(
        id
      )
      .subscribe({
        next:
          roomType => {

            this.roomType.set(
              roomType
            );

            this.loading.set(
              false
            );
          },
        error:
          error => {

            this.error.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'roomTypes.loadOneFailed'
                )
              )
            );

            this.loading.set(
              false
            );
          }
      });
  }

  save(
    value: RoomTypeFormValue
  ): void {

    const roomType =
      this.roomType();

    if (
      !roomType
      ||
      this.saving()
    ) {
      return;
    }

    this.saving.set(
      true
    );

    this.api
      .update(
        roomType.id,
        {
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
        }
      )
      .subscribe({
        next:
          updated => {

            this.toast.success(
              this.translation.translate(
                'roomTypes.updateSuccess'
              )
            );

            void this.router.navigate([
              '/app/property/room-types',
              updated.id
            ]);
          },
        error:
          error => {

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'roomTypes.updateFailed'
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

    const roomType =
      this.roomType();

    void this.router.navigate(
      roomType
        ? [
          '/app/property/room-types',
          roomType.id
        ]
        : [
          '/app/property/room-types'
        ]
    );
  }

}
