import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  RouterLink
} from '@angular/router';

import {
  LucideCrown,
  LucideEye,
  LucidePencil,
  LucideRefreshCw,
  LucideSearch,
  LucideUserRoundPlus,
  LucideUsers,
  LucideX
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
  selector: 'app-guests-list-page',
  standalone: true,
  imports: [
    RouterLink,
    TranslationPipe,
    SpinComponent,
    GuestVipBadgeComponent,
    LucideCrown,
    LucideEye,
    LucidePencil,
    LucideRefreshCw,
    LucideSearch,
    LucideUserRoundPlus,
    LucideUsers,
    LucideX
  ],
  templateUrl: './guests-list.page.html',
  styleUrl: './guests-list.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GuestsListPage
  implements OnInit {

  readonly auth =
    inject(AuthStore);

  private readonly api =
    inject(GuestsApiService);

  private readonly translation =
    inject(TranslationService);

  readonly guests =
    signal<Guest[]>([]);

  readonly loading =
    signal(true);

  readonly errorMessage =
    signal('');

  readonly search =
    signal('');

  readonly vipFilter =
    signal<'all' | 'vip' | 'regular'>(
      'all'
    );

  readonly backendTotalItems =
    signal<number | null>(null);

  readonly filtered =
    computed(() => {
      const keyword =
        this.search()
          .trim()
          .toLowerCase();

      const vip =
        this.vipFilter();

      return this.guests()
        .filter(guest => {
          if (
            vip === 'vip' &&
            !guest.isVip
          ) {
            return false;
          }

          if (
            vip === 'regular' &&
            guest.isVip
          ) {
            return false;
          }

          if (!keyword) {
            return true;
          }

          const haystack =
            [
              guest.fullName,
              guest.firstName,
              guest.lastName,
              guest.phone ?? '',
              guest.email ?? ''
            ]
              .join(' ')
              .toLowerCase();

          return haystack.includes(
            keyword
          );
        });
    });

  readonly loadedCount =
    computed(
      () =>
        this.guests().length
    );

  readonly vipCount =
    computed(
      () =>
        this.guests()
          .filter(
            guest =>
              guest.isVip
          )
          .length
    );

  readonly regularCount =
    computed(
      () =>
        this.loadedCount()
        -
        this.vipCount()
    );

  readonly linkedAccountCount =
    computed(
      () =>
        this.guests()
          .filter(
            guest =>
              !!guest.userId
          )
          .length
    );

  readonly hasFilters =
    computed(
      () =>
        !!this.search().trim()
        ||
        this.vipFilter()
        !== 'all'
    );

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.api
      .getAll()
      .subscribe({
        next:
          result => {
            this.guests.set(
              result.items
            );

            this.backendTotalItems.set(
              result.totalItems
              ??
              null
            );

            this.loading.set(false);
          },

        error:
          error => {
            this.guests.set([]);
            this.backendTotalItems.set(null);

            this.errorMessage.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'guests.loadFailed'
                )
              )
            );

            this.loading.set(false);
          }
      });
  }

  setSearch(
    event: Event
  ): void {
    const target =
      event.target;

    if (
      !(target instanceof HTMLInputElement)
    ) {
      return;
    }

    this.search.set(
      target.value
    );
  }

  setVipFilter(
    event: Event
  ): void {
    const target =
      event.target;

    if (
      !(target instanceof HTMLSelectElement)
    ) {
      return;
    }

    const value =
      target.value;

    this.vipFilter.set(
      value === 'vip'
        ? 'vip'
        : value === 'regular'
          ? 'regular'
          : 'all'
    );
  }

  clearFilters(): void {
    this.search.set('');
    this.vipFilter.set('all');
  }
}
