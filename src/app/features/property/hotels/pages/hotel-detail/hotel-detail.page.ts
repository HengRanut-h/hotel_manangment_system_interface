import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  DatePipe
} from '@angular/common';

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
  HotelApiService
} from '../../data-access/hotel-api.service';

import {
  Hotel
} from '../../models/hotel.model';


@Component({
  selector:
    'app-hotel-detail-page',

  standalone:
    true,

  imports: [
    RouterLink,
    DatePipe,

    TranslationPipe,

    SpinComponent,

    LucideArrowLeft,
    LucidePencil
  ],

  templateUrl:
    './hotel-detail.page.html',

  styleUrl:
    './hotel-detail.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class HotelDetailPage
  implements OnInit {

  readonly auth =
    inject(
      AuthStore
    );

  private readonly api =
    inject(
      HotelApiService
    );

  private readonly route =
    inject(
      ActivatedRoute
    );

  private readonly translation =
    inject(
      TranslationService
    );


  readonly hotel =
    signal<Hotel | null>(
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
          'hotels.missingId'
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
          hotel => {

            this.hotel.set(
              hotel
            );

            this.loading.set(
              false
            );

          },

        error:
          error => {

            this.hotel.set(
              null
            );

            this.error.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'hotels.loadOneFailed'
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
