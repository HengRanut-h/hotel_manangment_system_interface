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
  GoodsReceiptStatusBadgeComponent
} from '../../components/goods-receipt-status-badge/goods-receipt-status-badge.component';

import {
  GoodsReceiptsApiService
} from '../../data-access/goods-receipts-api.service';

import {
  PurchaseOrderLookupItem,
  GoodsReceipt
} from '../../models/goods-receipt.model';

@Component({
  selector:
    'app-goods-receipts-detail-page',

  standalone:
    true,

  imports: [
    DatePipe,
    DecimalPipe,
    RouterLink,
    TranslationPipe,
    SpinComponent,
    GoodsReceiptStatusBadgeComponent,
    LucideArrowLeft,
    LucideCheckCircle2,
    LucideClipboardList,
    LucidePencil,
    LucideRefreshCw
  ],

  templateUrl:
    './goods-receipts-detail.page.html',

  styleUrl:
    './goods-receipts-detail.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class GoodsReceiptsDetailPage
  implements OnInit {

  readonly auth =
    inject(AuthStore);

  private readonly api =
    inject(GoodsReceiptsApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly toast =
    inject(ToastService);

  private readonly translation =
    inject(TranslationService);

  readonly item =
    signal<GoodsReceipt | null>(null);

  readonly loading =
    signal(true);

  readonly errorMessage =
    signal('');

  readonly statusDraft =
    signal('');

  readonly purchaseOrders =
    signal<PurchaseOrderLookupItem[]>([]);

  readonly updatingStatus =
    signal(false);

  ngOnInit(): void {

    this.loadPurchaseOrders();
    this.load();
  }

  private loadPurchaseOrders():
    void {

    this.api
      .getPurchaseOrders()
      .subscribe({

        next:
          items => {

            this.purchaseOrders.set(
              Array.isArray(items)
                ? items
                : []
            );
          },

        error:
          () => {

            this.purchaseOrders.set([]);
          }
      });
  }

  purchaseOrderLabel(
    id: string | null
  ): string {

    if (!id) {
      return '—';
    }

    const item =
      this.purchaseOrders()
        .find(
          candidate =>
            candidate.id === id
        );

    if (!item) {
      return '—';
    }

    return [
      item.referenceNumber,
      item.title
    ]
      .filter(Boolean)
      .join(' — ');
  }

  load(): void {

    const id =
      this.route.snapshot.paramMap
        .get('id');

    if (!id) {
      this.loading.set(false);

      this.errorMessage.set(
        this.translation.translate(
          'goodsReceipts.missingId'
        )
      );

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

            this.statusDraft.set(
              item.status
            );

            this.loading.set(false);
          },

        error:
          error => {

            this.errorMessage.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'goodsReceipts.loadOneFailed'
                )
              )
            );

            this.loading.set(false);
          }
      });
  }

  setStatusDraft(
    event: Event
  ): void {

    const target =
      event.target;

    if (
      !(target instanceof HTMLInputElement)
    ) {
      return;
    }

    this.statusDraft.set(
      target.value
    );
  }

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
        'goods-receipts.update'
      )
    ) {
      return;
    }

    this.updatingStatus.set(true);

    this.api
      .changeStatus(
        item.id,
        {
          status
        }
      )
      .subscribe({

        next:
          () => {

            this.updatingStatus.set(false);

            this.toast.success(
              this.translation.translate(
                'goodsReceipts.statusUpdateSuccess'
              )
            );

            this.load();
          },

        error:
          error => {

            this.updatingStatus.set(false);

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'goodsReceipts.statusUpdateFailed'
                )
              )
            );
          }
      });
  }
}
