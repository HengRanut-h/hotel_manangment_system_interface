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
  LucideLink,
  LucideMail,
  LucidePencil,
  LucidePhone,
  LucideRefreshCw,
  LucideUserRound
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
  GuestVipBadgeComponent
} from '../../components/guest-vip-badge/guest-vip-badge.component';

import {
  GuestsApiService
} from '../../data-access/guests-api.service';

import {
  Guest
} from '../../models/guest.model';

@Component({
  selector: 'app-guest-detail-page',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    TranslationPipe,
    SpinComponent,
    GuestVipBadgeComponent,
    LucideArrowLeft,
    LucideLink,
    LucideMail,
    LucidePencil,
    LucidePhone,
    LucideRefreshCw,
    LucideUserRound
  ],
  templateUrl: './guest-detail.page.html',
  styleUrl: './guest-detail.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GuestDetailPage
  implements OnInit {

  readonly auth =
    inject(AuthStore);

  private readonly api =
    inject(GuestsApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly translation =
    inject(TranslationService);

  readonly guest =
    signal<Guest | null>(null);

  readonly loading =
    signal(true);

  readonly errorMessage =
    signal('');

  private id = '';

  ngOnInit(): void {
    this.id =
      this.route.snapshot
        .paramMap
        .get('id')
      ??
      '';

    if (!this.id) {
      this.loading.set(false);

      this.errorMessage.set(
        this.translation.translate(
          'guests.invalidGuestId'
        )
      );

      return;
    }

    this.load();
  }

  load(): void {
    if (!this.id) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.api
      .getById(this.id)
      .subscribe({
        next:
          guest => {
            this.guest.set(guest);
            this.loading.set(false);
          },

        error:
          error => {
            this.guest.set(null);

            this.errorMessage.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'guests.detailLoadFailed'
                )
              )
            );

            this.loading.set(false);
          }
      });
  }
}
