import {
  DatePipe,
  DecimalPipe
} from '@angular/common';

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
  LucideChevronLeft,
  LucideChevronRight,
  LucideCirclePlus,
  LucideClipboardList,
  LucideEye,
  LucidePencil,
  LucideRefreshCw,
  LucideSearch,
  LucideTrash2,
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
  ToastService
} from '../../../../../shared/ui/toast/toast.service';

import {
  LaundryStatusBadgeComponent
} from '../../components/laundry-status-badge/laundry-status-badge.component';

import {
  LaundryApiService
} from '../../data-access/laundry-api.service';

import {
  LaundryRequest
} from '../../models/laundry.model';

@Component({
  selector:
    'app-laundry-list-page',

  standalone:
    true,

  imports: [
    DatePipe,
    DecimalPipe,
    RouterLink,
    TranslationPipe,
    SpinComponent,
    LaundryStatusBadgeComponent,
    LucideChevronLeft,
    LucideChevronRight,
    LucideCirclePlus,
    LucideClipboardList,
    LucideEye,
    LucidePencil,
    LucideRefreshCw,
    LucideSearch,
    LucideTrash2,
    LucideX
  ],

  templateUrl:
    './laundry-list.page.html',

  styleUrl:
    './laundry-list.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class LaundryListPage
  implements OnInit {

  readonly auth =
    inject(AuthStore);

  private readonly api =
    inject(LaundryApiService);

  private readonly translation =
    inject(TranslationService);

  private readonly toast =
    inject(ToastService);

  readonly items =
    signal<LaundryRequest[]>([]);

  readonly loading =
    signal(true);

  readonly errorMessage =
    signal('');

  readonly search =
    signal('');

  readonly status =
    signal('');

  readonly pageNumber =
    signal(1);

  readonly pageSize =
    signal(20);

  readonly totalItems =
    signal(0);

  readonly deletingId =
    signal<string | null>(null);

  readonly deleteTarget =
    signal<LaundryRequest | null>(null);

  readonly inProgressOnPage =
    computed(
      () =>
        this.items()
          .filter(
            item =>
              item.status
                .trim()
                .toLowerCase()
              === 'inprogress'
          )
          .length
    );

  readonly otherStatusesOnPage =
    computed(
      () =>
        Math.max(
          0,
          this.items().length
          -
          this.inProgressOnPage()
        )
    );

  readonly totalPages =
    computed(
      () =>
        Math.max(
          1,
          Math.ceil(
            this.totalItems()
            /
            this.pageSize()
          )
        )
    );

  readonly hasPreviousPage =
    computed(
      () =>
        this.pageNumber() > 1
    );

  readonly hasNextPage =
    computed(
      () =>
        this.pageNumber()
        <
        this.totalPages()
    );

  readonly hasFilters =
    computed(
      () =>
        this.search()
          .trim()
          .length > 0
        ||
        this.status()
          .trim()
          .length > 0
    );

  ngOnInit(): void {

    this.load();
  }

  load(): void {

    this.loading.set(true);
    this.errorMessage.set('');

    this.api
      .getPage({
        search:
          this.search(),

        status:
          this.status(),

        pageNumber:
          this.pageNumber(),

        pageSize:
          this.pageSize(),

        sortBy:
          'createdAt',

        sortDirection:
          'desc'
      })
      .subscribe({

        next:
          result => {

            this.items.set(
              Array.isArray(
                result.items
              )
                ? result.items
                : []
            );

            this.totalItems.set(
              Number(
                result.totalItems
                ??
                0
              )
            );

            this.pageNumber.set(
              Number(
                result.pageNumber
                ??
                this.pageNumber()
              )
            );

            this.pageSize.set(
              Number(
                result.pageSize
                ??
                this.pageSize()
              )
            );

            this.loading.set(false);
          },

        error:
          error => {

            this.items.set([]);
            this.totalItems.set(0);

            this.errorMessage.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'laundry.loadFailed'
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

  setStatus(
    event: Event
  ): void {

    const target =
      event.target;

    if (
      !(target instanceof HTMLInputElement)
    ) {
      return;
    }

    this.status.set(
      target.value
    );
  }

  onSearchKeydown(
    event: KeyboardEvent
  ): void {

    if (
      event.key !== 'Enter'
    ) {
      return;
    }

    event.preventDefault();
    this.applyFilters();
  }

  applyFilters(): void {

    if (this.loading()) {
      return;
    }

    this.pageNumber.set(1);
    this.load();
  }

  clearFilters(): void {

    if (this.loading()) {
      return;
    }

    this.search.set('');
    this.status.set('');
    this.pageNumber.set(1);
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
        Math.max(
          1,
          value - 1
        )
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

  requestDelete(
    item: LaundryRequest
  ): void {

    if (
      this.deletingId() !== null
      ||
      !this.auth.hasPermission(
        'laundry.delete'
      )
    ) {
      return;
    }

    this.deleteTarget.set(item);
  }

  cancelDelete(): void {

    if (
      this.deletingId() !== null
    ) {
      return;
    }

    this.deleteTarget.set(null);
  }

  confirmDelete(): void {

    const item =
      this.deleteTarget();

    if (
      item === null
      ||
      this.deletingId() !== null
    ) {
      return;
    }

    this.deletingId.set(
      item.id
    );

    this.api
      .delete(
        item.id
      )
      .subscribe({

        next:
          () => {

            this.deletingId.set(null);
            this.deleteTarget.set(null);

            this.toast.success(
              this.translation.translate(
                'laundry.deleteSuccess'
              )
            );

            if (
              this.items().length === 1
              &&
              this.pageNumber() > 1
            ) {
              this.pageNumber.update(
                value =>
                  Math.max(
                    1,
                    value - 1
                  )
              );
            }

            this.load();
          },

        error:
          error => {

            this.deletingId.set(null);

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'laundry.deleteFailed'
                )
              )
            );
          }
      });
  }
}
