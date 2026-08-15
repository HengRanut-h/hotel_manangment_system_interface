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
  PurchaseOrderStatusBadgeComponent
} from '../../components/purchase-order-status-badge/purchase-order-status-badge.component';

import {
  PurchaseOrdersApiService
} from '../../data-access/purchase-orders-api.service';

import {
  SupplierLookupItem,
  PurchaseOrder
} from '../../models/purchase-order.model';

@Component({
  selector:
    'app-purchase-orders-detail-page',

  standalone:
    true,

  imports: [
    DatePipe,
    DecimalPipe,
    RouterLink,
    TranslationPipe,
    SpinComponent,
    PurchaseOrderStatusBadgeComponent,
    LucideArrowLeft,
    LucideCheckCircle2,
    LucideClipboardList,
    LucidePencil,
    LucideRefreshCw
  ],

  templateUrl:
    './purchase-orders-detail.page.html',

  styleUrl:
    './purchase-orders-detail.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class PurchaseOrdersDetailPage
  implements OnInit {

  readonly auth =
    inject(AuthStore);

  private readonly api =
    inject(PurchaseOrdersApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly toast =
    inject(ToastService);

  private readonly translation =
    inject(TranslationService);

  readonly item =
    signal<PurchaseOrder | null>(null);

  readonly loading =
    signal(true);

  readonly errorMessage =
    signal('');

  readonly statusDraft =
    signal('');

  readonly suppliers =
    signal<SupplierLookupItem[]>([]);

  readonly updatingStatus =
    signal(false);

  ngOnInit(): void {

    this.loadSuppliers();
    this.load();
  }

  private loadSuppliers():
    void {

    this.api
      .getSuppliers()
      .subscribe({

        next:
          items => {

            this.suppliers.set(
              Array.isArray(items)
                ? items
                : []
            );
          },

        error:
          () => {

            this.suppliers.set([]);
          }
      });
  }

  supplierLabel(
    id: string | null
  ): string {

    if (!id) {
      return '—';
    }

    const item =
      this.suppliers()
        .find(
          candidate =>
            candidate.id === id
        );

    if (!item) {
      return '—';
    }

    return [
      item.code,
      item.name
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
          'purchaseOrders.missingId'
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
                  'purchaseOrders.loadOneFailed'
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
        'purchase-orders.update'
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
                'purchaseOrders.statusUpdateSuccess'
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
                  'purchaseOrders.statusUpdateFailed'
                )
              )
            );
          }
      });
  }
}
