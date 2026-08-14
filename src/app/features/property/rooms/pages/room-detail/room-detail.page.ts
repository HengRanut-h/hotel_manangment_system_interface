import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import {
  LucideArrowLeft,
  LucidePencil
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
  RoomApiService
} from '../../data-access/room-api.service';

import {
  Room,
  RoomStatus
} from '../../models/room.model';

@Component({
  selector: 'app-room-detail-page',
  standalone: true,
  imports: [
    RouterLink,
    TranslationPipe,
    SpinComponent,
    LucideArrowLeft,
    LucidePencil
  ],
  templateUrl: './room-detail.page.html',
  styleUrl: './room-detail.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomDetailPage
  implements OnInit {

  readonly auth =
    inject(
      AuthStore
    );

  private readonly api =
    inject(
      RoomApiService
    );

  private readonly route =
    inject(
      ActivatedRoute
    );

  private readonly translation =
    inject(
      TranslationService
    );

  readonly room =
    signal<Room | null>(
      null
    );

  readonly loading =
    signal(
      true
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

            this.room.set(
              null
            );

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

  statusKey(
    status: RoomStatus
  ): string {

    return `rooms.statuses.${status}`;
  }

}
