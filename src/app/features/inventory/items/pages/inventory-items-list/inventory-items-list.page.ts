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
  LucideAlertTriangle,
  LucideBoxes,
  LucideCirclePlus,
  LucidePackage,
  LucideRefreshCw,
  LucideSearch,
  LucideTrendingDown,
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
  InventoryStockBadgeComponent
} from '../../components/inventory-stock-badge/inventory-stock-badge.component';

import {
  InventoryItemsApiService
} from '../../data-access/inventory-items-api.service';

import {
  InventoryItem
} from '../../models/inventory-item.model';

@Component({
  selector:
    'app-inventory-items-list-page',

  standalone:
    true,

  imports: [
    DatePipe,
    DecimalPipe,
    RouterLink,
    TranslationPipe,
    SpinComponent,
    InventoryStockBadgeComponent,
    LucideAlertTriangle,
    LucideBoxes,
    LucideCirclePlus,
    LucidePackage,
    LucideRefreshCw,
    LucideSearch,
    LucideTrendingDown,
    LucideX
  ],

  templateUrl:
    './inventory-items-list.page.html',

  styleUrl:
    './inventory-items-list.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class InventoryItemsListPage
  implements OnInit {

  readonly auth =
    inject(AuthStore);

  private readonly api =
    inject(InventoryItemsApiService);

  private readonly translation =
    inject(TranslationService);

  readonly items =
    signal<InventoryItem[]>([]);

  readonly loading =
    signal(true);

  readonly errorMessage =
    signal('');

  readonly search =
    signal('');

  readonly stockFilter =
    signal<
      'all'
      |
      'healthy'
      |
      'low'
      |
      'out'
    >('all');

  readonly filteredItems =
    computed(
      () => {

        const keyword =
          this.search()
            .trim()
            .toLowerCase();

        const filter =
          this.stockFilter();

        return this.items()
          .filter(
            item => {

              if (keyword) {
                const haystack =
                  [
                    item.sku,
                    item.name,
                    item.unit
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

              const status =
                this.stockStatus(item);

              return (
                filter === 'all'
                ||
                filter === status
              );
            }
          );
      }
    );

  readonly lowStockCount =
    computed(
      () =>
        this.items()
          .filter(
            item =>
              item.quantityOnHand > 0
              &&
              item.quantityOnHand
              <=
              item.reorderLevel
          )
          .length
    );

  readonly outOfStockCount =
    computed(
      () =>
        this.items()
          .filter(
            item =>
              item.quantityOnHand <= 0
          )
          .length
    );

  readonly totalQuantity =
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
                item.quantityOnHand
                ||
                0
              ),
            0
          )
    );

  readonly hasFilters =
    computed(
      () =>
        this.search()
          .trim()
          .length > 0
        ||
        this.stockFilter()
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
          items => {

            this.items.set(
              Array.isArray(items)
                ? items
                : []
            );

            this.loading.set(false);
          },

        error:
          error => {

            this.items.set([]);

            this.errorMessage.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'inventoryItems.loadFailed'
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

  setStockFilter(
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
      value === 'healthy'
      ||
      value === 'low'
      ||
      value === 'out'
    ) {
      this.stockFilter.set(value);
      return;
    }

    this.stockFilter.set('all');
  }

  clearFilters(): void {

    this.search.set('');
    this.stockFilter.set('all');
  }

  private stockStatus(
    item: InventoryItem
  ):
    'healthy'
    |
    'low'
    |
    'out' {

    if (
      item.quantityOnHand <= 0
    ) {
      return 'out';
    }

    if (
      item.quantityOnHand
      <=
      item.reorderLevel
    ) {
      return 'low';
    }

    return 'healthy';
  }
}
