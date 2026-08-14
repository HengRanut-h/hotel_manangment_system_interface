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
  LucideBedDouble,
  LucideChevronLeft,
  LucideChevronRight,
  LucideDoorOpen,
  LucideEye,
  LucidePencil,
  LucidePlus,
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
  RoomApiService
} from '../../data-access/room-api.service';

import {
  Room,
  RoomQuery,
  RoomStatus,
  roomStatuses
} from '../../models/room.model';

@Component({
  selector: 'app-room-list-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    TranslationPipe,
    SpinComponent,
    LucideBedDouble,
    LucideChevronLeft,
    LucideChevronRight,
    LucideDoorOpen,
    LucideEye,
    LucidePencil,
    LucidePlus,
    LucideRotateCcw,
    LucideSearch,
    LucideTrash2
  ],
  templateUrl: './room-list.page.html',
  styleUrl: './room-list.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomListPage
  implements OnInit {

  readonly auth =
    inject(
      AuthStore
    );

  private readonly api =
    inject(
      RoomApiService
    );

  private readonly toast =
    inject(
      ToastService
    );

  private readonly translation =
    inject(
      TranslationService
    );

  readonly statusOptions =
    roomStatuses;

  readonly rooms =
    signal<Room[]>(
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
      RoomQuery = {
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

            this.rooms.set(
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

            this.rooms.set(
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
                  'rooms.loadFailed'
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

  changeStatus(
    room: Room,
    status: RoomStatus
  ): void {

    if (
      this.mutatingId()
      ||
      status === room.status
    ) {
      return;
    }

    this.mutatingId.set(
      room.id
    );

    this.api
      .changeStatus(
        room.id,
        {
          status
        }
      )
      .subscribe({
        next:
          () => {

            this.toast.success(
              this.translation.translate(
                'rooms.statusUpdateSuccess'
              )
            );

            this.mutatingId.set(
              null
            );

            this.load();
          },
        error:
          error => {

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'rooms.statusUpdateFailed'
                )
              )
            );

            this.mutatingId.set(
              null
            );
          }
      });
  }

  deleteRoom(
    room: Room
  ): void {

    if (
      this.mutatingId()
    ) {
      return;
    }

    const message =
      this.translation.translate(
        'rooms.deleteConfirm',
        {
          number:
            room.roomNumber
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
      room.id
    );

    this.api
      .delete(
        room.id
      )
      .subscribe({
        next:
          () => {

            this.toast.success(
              this.translation.translate(
                'rooms.deleteSuccess'
              )
            );

            this.mutatingId.set(
              null
            );

            if (
              this.rooms().length === 1
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
                  'rooms.deleteFailed'
                )
              )
            );

            this.mutatingId.set(
              null
            );
          }
      });
  }

  statusKey(
    status: RoomStatus
  ): string {

    return `rooms.statuses.${status}`;
  }

}
