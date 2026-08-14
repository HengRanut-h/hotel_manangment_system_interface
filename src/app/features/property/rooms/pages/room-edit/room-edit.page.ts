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
  RoomTypeApiService
} from '../../../room-types/data-access/room-type-api.service';

import {
  RoomFormComponent,
  RoomFormValue
} from '../../components/room-form/room-form.component';

import {
  RoomApiService
} from '../../data-access/room-api.service';

import {
  Room,
  RoomOption
} from '../../models/room.model';

@Component({
  selector: 'app-room-edit-page',
  standalone: true,
  imports: [
    RouterLink,
    TranslationPipe,
    SpinComponent,
    RoomFormComponent,
    LucideArrowLeft
  ],
  templateUrl: './room-edit.page.html',
  styleUrl: './room-edit.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomEditPage
  implements OnInit {

  private readonly api =
    inject(
      RoomApiService
    );

  private readonly roomTypeApi =
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

  readonly room =
    signal<Room | null>(
      null
    );

  readonly roomTypeOptions =
    signal<RoomOption[]>(
      []
    );

  readonly loading =
    signal(
      true
    );

  readonly loadingOptions =
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
    this.loadOptions();
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
          'rooms.missingId'
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
          room => {

            this.room.set(
              room
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
                  'rooms.loadOneFailed'
                )
              )
            );

            this.loading.set(
              false
            );
          }
      });
  }

  loadOptions(): void {

    this.loadingOptions.set(
      true
    );

    this.roomTypeApi
      .getPage({
        pageNumber: 1,
        pageSize: 100
      })
      .subscribe({
        next:
          result => {

            this.roomTypeOptions.set(
              result.items.map(
                item => ({
                  id:
                    item.id,
                  name:
                    item.name,
                  code:
                    item.code
                })
              )
            );

            this.loadingOptions.set(
              false
            );
          },
        error:
          () => {

            this.roomTypeOptions.set(
              []
            );

            this.loadingOptions.set(
              false
            );
          }
      });
  }

  save(
    value: RoomFormValue
  ): void {

    const room =
      this.room();

    if (
      !room
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
        room.id,
        {
          roomTypeId:
            value.roomTypeId,
          roomNumber:
            value.roomNumber,
          floor:
            value.floor
        }
      )
      .subscribe({
        next:
          updated => {

            this.toast.success(
              this.translation.translate(
                'rooms.updateSuccess'
              )
            );

            void this.router.navigate([
              '/app/property/rooms',
              updated.id
            ]);
          },
        error:
          error => {

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'rooms.updateFailed'
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

    const room =
      this.room();

    void this.router.navigate(
      room
        ? [
          '/app/property/rooms',
          room.id
        ]
        : [
          '/app/property/rooms'
        ]
    );
  }

}
