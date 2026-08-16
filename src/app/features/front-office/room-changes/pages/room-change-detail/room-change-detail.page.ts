import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import {
  LucideArrowLeft,
  LucideArrowRight,
  LucideBed,
  LucideClipboardList,
  LucideClock,
  LucideFileText,
  LucideRefreshCw,
  LucideShuffle,
  LucideUser
} from '@lucide/angular';

import {
  finalize
} from 'rxjs';

import {
  takeUntilDestroyed
} from '@angular/core/rxjs-interop';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  RoomChange
} from '../../models/room-change.model';

import {
  RoomChangesApiService
} from '../../services/room-changes-api.service';

import {
  RoomChangeStatusBadgeComponent
} from '../../components/room-change-status-badge/room-change-status-badge.component';

@Component({
  selector:
    'app-room-change-detail-page',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,
    TranslationPipe,
    RoomChangeStatusBadgeComponent,
    LucideArrowLeft,
    LucideArrowRight,
    LucideBed,
    LucideClipboardList,
    LucideClock,
    LucideFileText,
    LucideRefreshCw,
    LucideShuffle,
    LucideUser
  ],

  templateUrl:
    './room-change-detail.page.html',

  styleUrl:
    './room-change-detail.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class RoomChangeDetailPage {

  private readonly api =
    inject(RoomChangesApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly roomChange =
    signal<RoomChange | null>(
      null
    );

  readonly loading =
    signal(false);

  readonly errorKey =
    signal<string | null>(
      null
    );

  constructor() {

    const id =
      this.route
        .snapshot
        .paramMap
        .get(
          'id'
        );

    if (
      !id
    ) {

      this.errorKey.set(
        'roomChanges.errors.missingId'
      );

      return;
    }

    this.loadRoomChange(
      id
    );
  }

  loadRoomChange(
    id: string
  ): void {

    this.loading.set(
      true
    );

    this.errorKey.set(
      null
    );

    this.api
      .getById(
        id
      )
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        ),

        finalize(
          () =>
            this.loading.set(
              false
            )
        )
      )
      .subscribe({
        next:
          item =>
            this.roomChange.set(
              item
            ),

        error:
          error => {

            console.error(
              error
            );

            this.errorKey.set(
              'roomChanges.errors.loadDetail'
            );
          }
      });
  }
}
