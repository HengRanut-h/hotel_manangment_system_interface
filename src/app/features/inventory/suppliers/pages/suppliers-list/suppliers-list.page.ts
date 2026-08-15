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
  LucideTruck,
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
  SupplierStatusBadgeComponent
} from '../../components/supplier-status-badge/supplier-status-badge.component';

import {
  SuppliersApiService
} from '../../data-access/suppliers-api.service';

import {
  Supplier
} from '../../models/supplier.model';

@Component({
  selector:
    'app-suppliers-list-page',

  standalone:
    true,

  imports: [
    DatePipe,
    RouterLink,
    TranslationPipe,
    SpinComponent,
    SupplierStatusBadgeComponent,
    LucideArchive,
    LucideCirclePlus,
    LucideEye,
    LucidePencil,
    LucideRefreshCw,
    LucideSearch,
    LucideTrash2,
    LucideTruck,
    LucideX
  ],

  templateUrl:
    './suppliers-list.page.html',

  styleUrl:
    './suppliers-list.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class SuppliersListPage
  implements OnInit {

  readonly auth =
    inject(AuthStore);

  private readonly api =
    inject(SuppliersApiService);

  private readonly toast =
    inject(ToastService);

  private readonly translation =
    inject(TranslationService);

  readonly suppliers =
    signal<Supplier[]>([]);

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

  readonly filteredSuppliers =
    computed(
      () => {

        const keyword =
          this.search()
            .trim()
            .toLowerCase();

        const status =
          this.statusFilter();

        return this.suppliers()
          .filter(
            supplier => {

              if (keyword) {
                const haystack =
                  [
                    supplier.name,
                    supplier.code,
                    supplier.description
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
                !supplier.isActive
              ) {
                return false;
              }

              if (
                status === 'inactive'
                &&
                supplier.isActive
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
        this.suppliers()
          .filter(
            supplier =>
              supplier.isActive
          )
          .length
    );

  readonly inactiveCount =
    computed(
      () =>
        this.suppliers()
          .filter(
            supplier =>
              !supplier.isActive
          )
          .length
    );

  readonly branchScopedCount =
    computed(
      () =>
        this.suppliers()
          .filter(
            supplier =>
              !!supplier.branchId
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
          suppliers => {

            this.suppliers.set(
              Array.isArray(suppliers)
                ? suppliers
                : []
            );

            this.loading.set(false);
          },

        error:
          error => {

            this.suppliers.set([]);

            this.errorMessage.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'suppliers.loadFailed'
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
                'suppliers.deleteSuccess'
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
                  'suppliers.deleteFailed'
                )
              )
            );
          }
      });
  }
}
