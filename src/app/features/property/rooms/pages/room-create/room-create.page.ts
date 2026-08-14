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
  BranchApiService
} from '../../../branches/data-access/branch-api.service';

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
  RoomOption
} from '../../models/room.model';

@Component({
  selector: 'app-room-create-page',
  standalone: true,
  imports: [
    RouterLink,
    TranslationPipe,
    RoomFormComponent,
    LucideArrowLeft
  ],
  templateUrl: './room-create.page.html',
  styleUrl: './room-create.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomCreatePage {

  private readonly api =
    inject(
      RoomApiService
    );

  private readonly branchApi =
    inject(
      BranchApiService
    );

  private readonly roomTypeApi =
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

  readonly branchOptions =
    signal<RoomOption[]>(
      []
    );

  readonly roomTypeOptions =
    signal<RoomOption[]>(
      []
    );

  readonly loadingOptions =
    signal(
      true
    );

  readonly optionsError =
    signal(
      ''
    );

  readonly saving =
    signal(
      false
    );

  constructor() {

    this.loadOptions();
  }

  loadOptions(): void {

    this.loadingOptions.set(
      true
    );

    this.optionsError.set(
      ''
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
          error => {

            this.optionsError.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'rooms.loadRoomTypesFailed'
                )
              )
            );

            this.loadingOptions.set(
              false
            );
          }
      });

    this.branchApi
      .getPage({
        pageNumber: 1,
        pageSize: 100,
        isActive: true
      })
      .subscribe({
        next:
          result => {

            this.branchOptions.set(
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
          },
        error:
          () => {

            this.branchOptions.set(
              []
            );
          }
      });
  }

  save(
    value: RoomFormValue
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
        branchId:
          value.branchId,
        roomTypeId:
          value.roomTypeId,
        roomNumber:
          value.roomNumber,
        floor:
          value.floor
      })
      .subscribe({
        next:
          room => {

            this.toast.success(
              this.translation.translate(
                'rooms.createSuccess'
              )
            );

            void this.router.navigate([
              '/app/property/rooms',
              room.id
            ]);
          },
        error:
          error => {

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'rooms.createFailed'
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
      '/app/property/rooms'
    ]);
  }

}
