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
  LucideCalendarCheck,
  LucideChevronLeft,
  LucideChevronRight,
  LucideCirclePlus,
  LucideClipboardList,
  LucideEye,
  LucideLink2,
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
  StayExtensionStatusBadgeComponent
} from '../../components/stay-extension-status-badge/stay-extension-status-badge.component';

import {
  StayExtensionsApiService
} from '../../data-access/stay-extensions-api.service';

import {
  ReservationLookup,
  StayExtension
} from '../../models/stay-extension.model';

@Component({
  selector:
    'app-stay-extensions-list-page',

  standalone:
    true,

  imports: [
    DatePipe,
    DecimalPipe,
    RouterLink,
    TranslationPipe,
    SpinComponent,
    StayExtensionStatusBadgeComponent,
    LucideCalendarCheck,
    LucideChevronLeft,
    LucideChevronRight,
    LucideCirclePlus,
    LucideClipboardList,
    LucideEye,
    LucideLink2,
    LucidePencil,
    LucideRefreshCw,
    LucideSearch,
    LucideTrash2,
    LucideX
  ],

  templateUrl:
    './stay-extensions-list.page.html',

  styleUrl:
    './stay-extensions-list.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class StayExtensionsListPage
  implements OnInit {

  readonly auth =
    inject(AuthStore);

  private readonly api =
    inject(StayExtensionsApiService);

  private readonly translation =
    inject(TranslationService);

  private readonly toast =
    inject(ToastService);

  readonly items =
    signal<StayExtension[]>([]);

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
    signal<StayExtension | null>(null);

  readonly reservations =
    signal<ReservationLookup[]>([]);

  readonly approvedOnPage =
    computed(
      () =>
        this.items()
          .filter(
            item =>
              item.status
                .trim()
                .toLowerCase()
              === 'approved'
          )
          .length
    );

  readonly linkedReservationsOnPage =
    computed(
      () =>
        this.items()
          .filter(
            item =>
              this.isReservationRelation(item.relatedEntityType)
              &&
              !!item.relatedEntityId
          )
          .length
    );

  readonly recordedAmountOnPage =
    computed(
      () =>
        this.items()
          .reduce(
            (
              total,
              item
            ) =>
              total
              +
              Number(
                item.amount
                ??
                0
              ),
            0
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
            Math.max(
              this.pageSize(),
              1
            )
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
    this.loadReservations();
    this.load();
  }

  isReservationRelation(
    relatedEntityType: string | null | undefined
  ): boolean {
    return (
      (relatedEntityType ?? '')
        .trim()
        .toLowerCase()
      === 'reservation'
    );
  }

  reservationById(
    id: string | null
  ): ReservationLookup | null {
    if (!id) {
      return null;
    }

    return (
      this.reservations()
        .find(
          candidate =>
            candidate.id === id
        )
      ??
      null
    );
  }

  reservationLabel(
    id: string | null
  ): string {
    const reservation =
      this.reservationById(id);

    if (!reservation) {
      return '—';
    }

    return [
      reservation.reservationNumber,
      reservation.guestName
    ]
      .filter(Boolean)
      .join(' — ')
      ||
      reservation.id;
  }

  reservationContext(
    id: string | null
  ): string {
    const reservation =
      this.reservationById(id);

    if (!reservation) {
      return '';
    }

    const checkout =
      reservation.checkOutDate
        ? `Checkout ${reservation.checkOutDate}`
        : '';

    const room =
      reservation.roomNumber
        ? `Room ${reservation.roomNumber}`
        : '';

    return [
      checkout,
      room,
      reservation.status
    ]
      .filter(Boolean)
      .join(' • ');
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
                  'stayExtensions.loadFailed'
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
    item: StayExtension
  ): void {
    if (
      this.deletingId() !== null
      ||
      !this.auth.hasPermission(
        'stay-extensions.delete'
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
                'stayExtensions.deleteSuccess'
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
                  'stayExtensions.deleteFailed'
                )
              )
            );
          }
      });
  }

  private loadReservations(): void {
    this.api
      .getReservations()
      .subscribe({

        next:
          items => {
            this.reservations.set(
              Array.isArray(items)
                ? items
                : []
            );
          },

        error:
          () => {
            this.reservations.set([]);
          }
      });
  }
}
