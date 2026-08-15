import {
  DatePipe,
  DecimalPipe
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
  LucideCheckCircle2,
  LucideClipboardList,
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
    'app-stock-transactions-detail-page',

  standalone:
    true,

  imports: [
    DatePipe,
    DecimalPipe,
    RouterLink,
    TranslationPipe,
    SpinComponent,
    StockTransactionStatusBadgeComponent,

    LucideArrowLeft,
    LucideCheckCircle2,
    LucideClipboardList,
    LucidePencil,
    LucideRefreshCw
  ],

  templateUrl:
    './stock-transactions-detail.page.html',

  styleUrl:
    './stock-transactions-detail.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class StockTransactionsDetailPage
  implements OnInit {


  // =========================================================
  // SERVICES
  // =========================================================

  readonly auth =
    inject(
      AuthStore
    );

  private readonly api =
    inject(
      StockTransactionsApiService
    );

  private readonly route =
    inject(
      ActivatedRoute
    );

  private readonly toast =
    inject(
      ToastService
    );

  private readonly translation =
    inject(
      TranslationService
    );


  // =========================================================
  // DATA
  // =========================================================

  readonly item =
    signal<StockTransaction | null>(
      null
    );

  readonly inventoryItems =
    signal<InventoryLookupItem[]>(
      []
    );


  // =========================================================
  // STATE
  // =========================================================

  readonly loading =
    signal(
      true
    );

  readonly errorMessage =
    signal(
      ''
    );

  readonly statusDraft =
    signal(
      ''
    );

  readonly updatingStatus =
    signal(
      false
    );


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.loadInventoryItems();

    this.load();
  }


  // =========================================================
  // INVENTORY ITEMS
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
  // LOAD DETAIL
  // =========================================================

  load(): void {

    const id =
      this.route
        .snapshot
        .paramMap
        .get(
          'id'
        );


    if (
      !id
    ) {

      this.loading.set(
        false
      );


      this.errorMessage.set(

        this.translation.translate(
          'stockTransactions.missingId'
        )
      );


      return;
    }


    this.loading.set(
      true
    );

    this.errorMessage.set(
      ''
    );


    this.api
      .getById(
        id
      )
      .subscribe({

        next:
          item => {

            this.item.set(
              item
            );


            this.statusDraft.set(
              item.status
            );


            this.loading.set(
              false
            );
          },


        error:
          error => {

            this.errorMessage.set(

              getSafeApiErrorMessage(

                error,

                this.translation.translate(
                  'stockTransactions.loadOneFailed'
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
  // STATUS INPUT
  // =========================================================

  setStatusDraft(
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


    this.statusDraft.set(
      target.value
    );
  }


  // =========================================================
  // SAVE STATUS
  // =========================================================

  saveStatus(): void {

    const item =
      this.item();


    const status =
      this.statusDraft()
        .trim();


    if (
      !item

      ||

      !status

      ||

      this.updatingStatus()

      ||

      !this.auth.hasPermission(
        'stock-transactions.update'
      )
    ) {

      return;
    }


    this.updatingStatus.set(
      true
    );


    this.api
      .changeStatus(
        item.id,
        {
          status
        }
      )
      .subscribe({

        next:
          updated => {

            this.item.set(
              updated
            );


            this.statusDraft.set(
              updated.status
            );


            this.updatingStatus.set(
              false
            );


            this.toast.success(

              this.translation.translate(
                'stockTransactions.statusUpdateSuccess'
              )
            );
          },


        error:
          error => {

            this.updatingStatus.set(
              false
            );


            this.toast.error(

              getSafeApiErrorMessage(

                error,

                this.translation.translate(
                  'stockTransactions.statusUpdateFailed'
                )
              )
            );
          }
      });
  }
}
