import {
  DecimalPipe
} from '@angular/common';

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  RouterLink
} from '@angular/router';

import {
  LucideChevronLeft,
  LucideChevronRight,
  LucideEye,
  LucidePencil,
  LucidePlus,
  LucidePower,
  LucideRotateCcw,
  LucideSearch,
  LucideTrash2
} from '@lucide/angular';

import {
  AuthStore
} from '../../../../../core/auth/auth.store';

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
} from '../../data-access/room-type-api.service';

import {
  RoomType,
  RoomTypeQuery
} from '../../models/room-type.model';

@Component({
  selector: 'app-room-type-list-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    DecimalPipe,
    TranslationPipe,
    SpinComponent,
    LucideChevronLeft,
    LucideChevronRight,
    LucideEye,
    LucidePencil,
    LucidePlus,
    LucidePower,
    LucideRotateCcw,
    LucideSearch,
    LucideTrash2
  ],
  templateUrl: './room-type-list.page.html',
  styleUrl: './room-type-list.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomTypeListPage
  implements OnInit {

  readonly auth =
    inject(
      AuthStore
    );

  private readonly api =
    inject(
      RoomTypeApiService
    );

  private readonly toast =
    inject(
      ToastService
    );

  private readonly translation =
    inject(
      TranslationService
    );

  readonly roomTypes =
    signal<RoomType[]>(
      []
    );

  readonly loading =
    signal(
      true
    );

  readonly error =
    signal(
      ''
    );

  readonly mutatingId =
    signal<string | null>(
      null
    );

  readonly search =
    signal(
      ''
    );

  readonly pageNumber =
    signal(
      1
    );

  readonly pageSize =
    signal(
      20
    );

  readonly totalCount =
    signal(
      0
    );

  readonly totalPages =
    signal(
      1
    );

  readonly hasPreviousPage =
    signal(
      false
    );

  readonly hasNextPage =
    signal(
      false
    );

  ngOnInit(): void {

    this.load();
  }

  load(): void {

    this.loading.set(
      true
    );

    this.error.set(
      ''
    );

    const query:
      RoomTypeQuery = {
      search:
        this.search()
          .trim(),
      pageNumber:
        this.pageNumber(),
      pageSize:
        this.pageSize()
    };

    this.api
      .getPage(
        query
      )
      .subscribe({
        next:
          result => {

            this.roomTypes.set(
              result.items
            );

            this.pageNumber.set(
              result.pageNumber
            );

            this.pageSize.set(
              result.pageSize
            );

            this.totalCount.set(
              result.totalItems
            );

            this.totalPages.set(
              Math.max(
                1,
                result.totalPages
              )
            );

            this.hasPreviousPage.set(
              result.hasPreviousPage
            );

            this.hasNextPage.set(
              result.hasNextPage
            );

            this.loading.set(
              false
            );
          },
        error:
          error => {

            this.roomTypes.set(
              []
            );

            this.totalCount.set(
              0
            );

            this.totalPages.set(
              1
            );

            this.hasPreviousPage.set(
              false
            );

            this.hasNextPage.set(
              false
            );

            this.error.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'roomTypes.loadFailed'
                )
              )
            );

            this.loading.set(
              false
            );
          }
      });
  }

  applySearch(): void {

    this.pageNumber.set(
      1
    );

    this.load();
  }

  clearSearch(): void {

    this.search.set(
      ''
    );

    this.pageNumber.set(
      1
    );

    this.load();
  }

  previousPage(): void {

    if (
      this.loading()
      ||
      !this.hasPreviousPage()
    ) {
      return;
    }

    this.pageNumber.update(
      value =>
        value - 1
    );

    this.load();
  }

  nextPage(): void {

    if (
      this.loading()
      ||
      !this.hasNextPage()
    ) {
      return;
    }

    this.pageNumber.update(
      value =>
        value + 1
    );

    this.load();
  }

  setActive(
    roomType: RoomType,
    active: boolean
  ): void {

    if (
      this.mutatingId()
    ) {
      return;
    }

    this.mutatingId.set(
      roomType.id
    );

    this.api
      .setActive(
        roomType.id,
        active
      )
      .subscribe({
        next:
          updated => {

            this.roomTypes.update(
              roomTypes =>
                roomTypes.map(
                  item =>
                    item.id === updated.id
                      ? updated
                      : item
                )
            );

            this.toast.success(
              this.translation.translate(
                active
                  ? 'roomTypes.activateSuccess'
                  : 'roomTypes.deactivateSuccess'
              )
            );

            this.mutatingId.set(
              null
            );
          },
        error:
          error => {

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  active
                    ? 'roomTypes.activateFailed'
                    : 'roomTypes.deactivateFailed'
                )
              )
            );

            this.mutatingId.set(
              null
            );
          }
      });
  }

  deleteRoomType(
    roomType: RoomType
  ): void {

    if (
      this.mutatingId()
    ) {
      return;
    }

    const message =
      this.translation.translate(
        'roomTypes.deleteConfirm',
        {
          name:
            roomType.name
        }
      );

    if (
      !window.confirm(
        message
      )
    ) {
      return;
    }

    this.mutatingId.set(
      roomType.id
    );

    this.api
      .delete(
        roomType.id
      )
      .subscribe({
        next:
          () => {

            this.toast.success(
              this.translation.translate(
                'roomTypes.deleteSuccess'
              )
            );

            this.mutatingId.set(
              null
            );

            if (
              this.roomTypes().length === 1
              &&
              this.pageNumber() > 1
            ) {
              this.pageNumber.update(
                value =>
                  value - 1
              );
            }

            this.load();
          },
        error:
          error => {

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'roomTypes.deleteFailed'
                )
              )
            );

            this.mutatingId.set(
              null
            );
          }
      });
  }

}
