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
  AmenityApiService
} from '../../data-access/amenity-api.service';

import {
  Amenity
} from '../../models/amenity.model';

@Component({
  selector: 'app-amenity-detail-page',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe,
    TranslationPipe,
    SpinComponent,
    LucideArrowLeft,
    LucidePencil
  ],
  templateUrl: './amenity-detail.page.html',
  styleUrl: './amenity-detail.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AmenityDetailPage
  implements OnInit {

  readonly auth =
    inject(
      AuthStore
    );

  private readonly api =
    inject(
      AmenityApiService
    );

  private readonly route =
    inject(
      ActivatedRoute
    );

  private readonly translation =
    inject(
      TranslationService
    );

  readonly amenity =
    signal<Amenity | null>(
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
          'amenities.missingId'
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
          amenity => {

            this.amenity.set(
              amenity
            );

            this.loading.set(
              false
            );
          },
        error:
          error => {

            this.amenity.set(
              null
            );

            this.error.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'amenities.loadOneFailed'
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
