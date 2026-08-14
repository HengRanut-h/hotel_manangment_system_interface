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
  RoomTypeApiService
} from '../../data-access/room-type-api.service';

import {
  RoomType
} from '../../models/room-type.model';

@Component({
  selector: 'app-room-type-detail-page',
  standalone: true,
  imports: [
    RouterLink,
    DecimalPipe,
    TranslationPipe,
    SpinComponent,
    LucideArrowLeft,
    LucidePencil
  ],
  templateUrl: './room-type-detail.page.html',
  styleUrl: './room-type-detail.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomTypeDetailPage
  implements OnInit {

  readonly auth =
    inject(
      AuthStore
    );

  private readonly api =
    inject(
      RoomTypeApiService
    );

  private readonly route =
    inject(
      ActivatedRoute
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

            this.roomType.set(
              null
            );

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

}
