import {
  DatePipe
} from '@angular/common';

import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import {
  LucideArrowLeft,
  LucidePencil,
  LucideRefreshCw
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
  GuestServicesApiService
} from '../../data-access/guest-services-api.service';

import {
  GuestService
} from '../../models/guest-services.model';

@Component({
  selector:
    'app-guest-services-detail-page',

  standalone:
    true,

  imports: [
    DatePipe,
    RouterLink,
    TranslationPipe,
    SpinComponent,
    LucideArrowLeft,
    LucidePencil,
    LucideRefreshCw
  ],

  templateUrl:
    './guest-services-detail.page.html',

  styleUrl:
    './guest-services-detail.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class GuestServicesDetailPage
  implements OnInit {

  readonly auth =
    inject(AuthStore);

  private readonly api =
    inject(GuestServicesApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly translation =
    inject(TranslationService);

  readonly item =
    signal<GuestService | null>(null);

  readonly loading =
    signal(true);

  readonly errorMessage =
    signal('');

  readonly id =
    signal('');

  ngOnInit(): void {

    const id =
      this.route.snapshot
        .paramMap
        .get('id');

    if (!id) {
      this.errorMessage.set(
        this.translation.translate(
          'guestServices.missingId'
        )
      );
      this.loading.set(false);
      return;
    }

    this.id.set(id);
    this.load();
  }

  load(): void {

    const id =
      this.id();

    if (!id) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.api
      .getById(id)
      .subscribe({

        next:
          item => {
            this.item.set(item);
            this.loading.set(false);
          },

        error:
          error => {
            this.errorMessage.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'guestServices.loadOneFailed'
                )
              )
            );
            this.loading.set(false);
          }
      });
  }
}
