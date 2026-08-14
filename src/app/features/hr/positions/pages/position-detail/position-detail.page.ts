import {
  DatePipe
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
  PositionApiService
} from '../../data-access/position-api.service';

import {
  Position
} from '../../models/position.model';

@Component({
  selector: 'app-position-detail.page',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe,
    TranslationPipe,
    SpinComponent,
    LucideArrowLeft,
    LucidePencil
  ],
  templateUrl: './position-detail.page.html',
  styleUrl: './position-detail.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PositionDetailPage
  implements OnInit {

  readonly auth =
    inject(
      AuthStore
    );

  private readonly api =
    inject(
      PositionApiService
    );

  private readonly route =
    inject(
      ActivatedRoute
    );

  private readonly translation =
    inject(
      TranslationService
    );

  readonly position =
    signal<Position | null>(
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
          'positions.missingId'
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
          position => {

            this.position.set(
              position
            );

            this.loading.set(
              false
            );
          },
        error:
          error => {

            this.position.set(
              null
            );

            this.error.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'positions.loadOneFailed'
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
