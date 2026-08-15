import {
  DatePipe
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
  LucideArchive,
  LucideCirclePlus,
  LucideEye,
  LucidePencil,
  LucideRefreshCw,
  LucideSearch,
  LucideTrash2,
  LucideWarehouse,
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
  WarehouseStatusBadgeComponent
} from '../../components/warehouse-status-badge/warehouse-status-badge.component';

import {
  WarehousesApiService
} from '../../data-access/warehouses-api.service';

import {
  Warehouse
} from '../../models/warehouse.model';

@Component({
  selector:
    'app-warehouses-list-page',

  standalone:
    true,

  imports: [
    DatePipe,
    RouterLink,
    TranslationPipe,
    SpinComponent,
    WarehouseStatusBadgeComponent,
    LucideArchive,
    LucideCirclePlus,
    LucideEye,
    LucidePencil,
    LucideRefreshCw,
    LucideSearch,
    LucideTrash2,
    LucideWarehouse,
    LucideX
  ],

  templateUrl:
    './warehouses-list.page.html',

  styleUrl:
    './warehouses-list.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class WarehousesListPage
  implements OnInit {

  readonly auth =
    inject(AuthStore);

  private readonly api =
    inject(WarehousesApiService);

  private readonly toast =
    inject(ToastService);

  private readonly translation =
    inject(TranslationService);

  readonly warehouses =
    signal<Warehouse[]>([]);

  readonly loading =
    signal(true);

  readonly errorMessage =
    signal('');

  readonly search =
    signal('');

  readonly statusFilter =
    signal<
      'all'
      |
      'active'
      |
      'inactive'
    >('all');

  readonly deletingId =
    signal<string | null>(null);

  readonly confirmDeleteId =
    signal<string | null>(null);

  readonly filteredWarehouses =
    computed(
      () => {

        const keyword =
          this.search()
            .trim()
            .toLowerCase();

        const status =
          this.statusFilter();

        return this.warehouses()
          .filter(
            warehouse => {

              if (keyword) {
                const haystack =
                  [
                    warehouse.name,
                    warehouse.code,
                    warehouse.description
                    ?? ''
                  ]
                    .join(' ')
                    .toLowerCase();

                if (
                  !haystack.includes(
                    keyword
                  )
                ) {
                  return false;
                }
              }

              if (
                status === 'active'
                &&
                !warehouse.isActive
              ) {
                return false;
              }

              if (
                status === 'inactive'
                &&
                warehouse.isActive
              ) {
                return false;
              }

              return true;
            }
          );
      }
    );

  readonly activeCount =
    computed(
      () =>
        this.warehouses()
          .filter(
            warehouse =>
              warehouse.isActive
          )
          .length
    );

  readonly inactiveCount =
    computed(
      () =>
        this.warehouses()
          .filter(
            warehouse =>
              !warehouse.isActive
          )
          .length
    );

  readonly branchScopedCount =
    computed(
      () =>
        this.warehouses()
          .filter(
            warehouse =>
              !!warehouse.branchId
          )
          .length
    );

  readonly hasFilters =
    computed(
      () =>
        this.search()
          .trim()
          .length > 0
        ||
        this.statusFilter()
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
          warehouses => {

            this.warehouses.set(
              Array.isArray(warehouses)
                ? warehouses
                : []
            );

            this.loading.set(false);
          },

        error:
          error => {

            this.warehouses.set([]);

            this.errorMessage.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'warehouses.loadFailed'
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

  setStatusFilter(
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

    if (
      value === 'active'
      ||
      value === 'inactive'
    ) {
      this.statusFilter.set(value);
      return;
    }

    this.statusFilter.set('all');
  }

  clearFilters(): void {

    this.search.set('');
    this.statusFilter.set('all');
  }

  requestDelete(
    id: string
  ): void {

    this.confirmDeleteId.set(id);
  }

  cancelDelete(): void {

    this.confirmDeleteId.set(null);
  }

  confirmDelete(
    id: string
  ): void {

    if (
      this.deletingId()
    ) {
      return;
    }

    this.deletingId.set(id);

    this.api
      .delete(id)
      .subscribe({

        next:
          () => {

            this.deletingId.set(null);
            this.confirmDeleteId.set(null);

            this.toast.success(
              this.translation.translate(
                'warehouses.deleteSuccess'
              )
            );

            this.load();
          },

        error:
          error => {

            this.deletingId.set(null);

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'warehouses.deleteFailed'
                )
              )
            );
          }
      });
  }
}
