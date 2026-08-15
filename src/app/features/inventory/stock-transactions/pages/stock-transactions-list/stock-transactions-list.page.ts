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
  StockTransactionStatusBadgeComponent
} from '../../components/stock-transaction-status-badge/stock-transaction-status-badge.component';

import {
  StockTransactionsApiService
} from '../../data-access/stock-transactions-api.service';

import {
  InventoryLookupItem,
  StockTransaction
} from '../../models/stock-transaction.model';


@Component({
  selector:
    'app-stock-transactions-list-page',

  standalone:
    true,

  imports: [
    DatePipe,
    DecimalPipe,
    RouterLink,
    TranslationPipe,
    SpinComponent,
    StockTransactionStatusBadgeComponent,

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
    './stock-transactions-list.page.html',

  styleUrl:
    './stock-transactions-list.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class StockTransactionsListPage
  implements OnInit {


  // =========================================================
  // SERVICES
  // =========================================================

  readonly auth =
    inject(AuthStore);

  private readonly api =
    inject(
      StockTransactionsApiService
    );

  private readonly translation =
    inject(
      TranslationService
    );

  private readonly toast =
    inject(
      ToastService
    );


  // =========================================================
  // DATA
  // =========================================================

  readonly items =
    signal<StockTransaction[]>(
      []
    );

  readonly inventoryItems =
    signal<InventoryLookupItem[]>(
      []
    );


  // =========================================================
  // LOADING
  // =========================================================

  readonly loading =
    signal(
      true
    );

  readonly errorMessage =
    signal(
      ''
    );


  // =========================================================
  // FILTERS
  // =========================================================

  readonly search =
    signal(
      ''
    );

  readonly status =
    signal(
      ''
    );


  // =========================================================
  // PAGINATION
  // =========================================================

  readonly pageNumber =
    signal(
      1
    );

  readonly pageSize =
    signal(
      20
    );

  readonly totalItems =
    signal(
      0
    );


  // =========================================================
  // DELETE
  // =========================================================

  readonly deletingId =
    signal<string | null>(
      null
    );

  readonly deleteTarget =
    signal<StockTransaction | null>(
      null
    );


  // =========================================================
  // SUMMARY
  // =========================================================

  readonly completedOnPage =
    computed(
      () =>
        this.items()
          .filter(
            item =>
              (
                item.status
                ??
                ''
              )
                .trim()
                .toLowerCase()
              ===
              'completed'
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


  // =========================================================
  // PAGINATION COMPUTED
  // =========================================================

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
        this.pageNumber()
        >
        1
    );


  readonly hasNextPage =
    computed(
      () =>
        this.pageNumber()
        <
        this.totalPages()
    );


  // =========================================================
  // FILTER STATE
  // =========================================================

  readonly hasFilters =
    computed(
      () =>
        this.search()
          .trim()
          .length
        >
        0

        ||

        this.status()
          .trim()
          .length
        >
        0
    );


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.loadInventoryItems();

    this.load();
  }


  // =========================================================
  // INVENTORY LOOKUP
  // =========================================================

  private loadInventoryItems():
    void {

    this.api
      .getInventoryItems()
      .subscribe({

        next:
          items => {

            this.inventoryItems.set(
              Array.isArray(
                items
              )
                ? items
                : []
            );
          },


        error:
          () => {

            this.inventoryItems.set(
              []
            );
          }
      });
  }


  // =========================================================
  // INVENTORY ITEM LABEL
  // =========================================================

  inventoryItemLabel(
    id:
      string
      |
      null
      |
      undefined
  ): string {

    if (
      !id
    ) {

      return '—';
    }


    const item =
      this.inventoryItems()
        .find(
          candidate =>
            candidate.id
            ===
            id
        );


    if (
      !item
    ) {

      return '—';
    }


    return [
      item.sku,
      item.name
    ]
      .filter(
        Boolean
      )
      .join(
        ' — '
      );
  }


  // =========================================================
  // INVENTORY ITEM RELATION
  // =========================================================

// Add this public method to BOTH:
// - StockTransactionsListPage
// - StockTransactionsDetailPage

isInventoryItemRelation(
  relatedEntityType: string | null | undefined
): boolean {
  return (
    (relatedEntityType ?? '')
      .trim()
      .toLowerCase()
    === 'inventoryitem'
  );
}

  // =========================================================
  // LOAD
  // =========================================================

  load(): void {

    this.loading.set(
      true
    );

    this.errorMessage.set(
      ''
    );


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


            this.loading.set(
              false
            );
          },


        error:
          error => {

            this.items.set(
              []
            );

            this.totalItems.set(
              0
            );


            this.errorMessage.set(

              getSafeApiErrorMessage(

                error,

                this.translation.translate(
                  'stockTransactions.loadFailed'
                )
              )
            );


            this.loading.set(
              false
            );
          }
      });
  }


  // =========================================================
  // SEARCH INPUT
  // =========================================================

  setSearch(
    event:
      Event
  ): void {

    const target =
      event.target;


    if (
      !(
        target
        instanceof
        HTMLInputElement
      )
    ) {

      return;
    }


    this.search.set(
      target.value
    );
  }


  // =========================================================
  // STATUS INPUT
  // =========================================================

  setStatus(
    event:
      Event
  ): void {

    const target =
      event.target;


    if (
      !(
        target
        instanceof
        HTMLInputElement
      )
    ) {

      return;
    }


    this.status.set(
      target.value
    );
  }


  // =========================================================
  // ENTER SEARCH
  // =========================================================

  onSearchKeydown(
    event:
      KeyboardEvent
  ): void {

    if (
      event.key
      !==
      'Enter'
    ) {

      return;
    }


    event.preventDefault();


    this.applyFilters();
  }


  // =========================================================
  // APPLY FILTER
  // =========================================================

  applyFilters(): void {

    if (
      this.loading()
    ) {

      return;
    }


    this.pageNumber.set(
      1
    );


    this.load();
  }


  // =========================================================
  // CLEAR FILTER
  // =========================================================

  clearFilters(): void {

    if (
      this.loading()
    ) {

      return;
    }


    this.search.set(
      ''
    );

    this.status.set(
      ''
    );

    this.pageNumber.set(
      1
    );


    this.load();
  }


  // =========================================================
  // PREVIOUS PAGE
  // =========================================================

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


  // =========================================================
  // NEXT PAGE
  // =========================================================

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


  // =========================================================
  // REQUEST DELETE
  // =========================================================

  requestDelete(
    item:
      StockTransaction
  ): void {

    if (
      this.deletingId()
      !==
      null

      ||

      !this.auth.hasPermission(
        'stock-transactions.delete'
      )
    ) {

      return;
    }


    this.deleteTarget.set(
      item
    );
  }


  // =========================================================
  // CANCEL DELETE
  // =========================================================

  cancelDelete(): void {

    if (
      this.deletingId()
      !==
      null
    ) {

      return;
    }


    this.deleteTarget.set(
      null
    );
  }


  // =========================================================
  // CONFIRM DELETE
  // =========================================================

  confirmDelete(): void {

    const item =
      this.deleteTarget();


    if (
      item
      ===
      null

      ||

      this.deletingId()
      !==
      null
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

            this.deletingId.set(
              null
            );

            this.deleteTarget.set(
              null
            );


            this.toast.success(

              this.translation.translate(
                'stockTransactions.deleteSuccess'
              )
            );


            if (
              this.items().length
              ===
              1

              &&

              this.pageNumber()
              >
              1
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

            this.deletingId.set(
              null
            );


            this.toast.error(

              getSafeApiErrorMessage(

                error,

                this.translation.translate(
                  'stockTransactions.deleteFailed'
                )
              )
            );
          }
      });
  }
}
