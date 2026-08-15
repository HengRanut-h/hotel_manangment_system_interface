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
  PurchaseRequestStatusBadgeComponent
} from '../../components/purchase-request-status-badge/purchase-request-status-badge.component';

import {
  PurchaseRequestsApiService
} from '../../data-access/purchase-requests-api.service';

import {
  InventoryLookupItem,
  PurchaseRequest
} from '../../models/purchase-request.model';

@Component({
  selector:
    'app-purchase-requests-detail-page',

  standalone:
    true,

  imports: [
    DatePipe,
    DecimalPipe,
    RouterLink,
    TranslationPipe,
    SpinComponent,
    PurchaseRequestStatusBadgeComponent,
    LucideArrowLeft,
    LucideCheckCircle2,
    LucideClipboardList,
    LucidePencil,
    LucideRefreshCw
  ],

  templateUrl:
    './purchase-requests-detail.page.html',

  styleUrl:
    './purchase-requests-detail.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class PurchaseRequestsDetailPage
  implements OnInit {

  readonly auth =
    inject(AuthStore);

  private readonly api =
    inject(PurchaseRequestsApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly toast =
    inject(ToastService);

  private readonly translation =
    inject(TranslationService);

  readonly item =
    signal<PurchaseRequest | null>(null);

  readonly loading =
    signal(true);

  readonly errorMessage =
    signal('');

  readonly statusDraft =
    signal('');

  readonly inventoryItems =
    signal<InventoryLookupItem[]>([]);

  readonly updatingStatus =
    signal(false);

  ngOnInit(): void {

    this.loadInventoryItems();
    this.load();
  }

  private loadInventoryItems():
    void {

    this.api
      .getInventoryItems()
      .subscribe({

        next:
          items => {

            this.inventoryItems.set(
              Array.isArray(items)
                ? items
                : []
            );
          },

        error:
          () => {

            this.inventoryItems.set([]);
          }
      });
  }

  inventoryItemLabel(
    id: string | null
  ): string {

    if (!id) {
      return '—';
    }

    const item =
      this.inventoryItems()
        .find(
          candidate =>
            candidate.id === id
        );

    if (!item) {
      return '—';
    }

    return [
      item.sku,
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
          'purchaseRequests.missingId'
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
                  'purchaseRequests.loadOneFailed'
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
        'purchase-requests.update'
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
                'purchaseRequests.statusUpdateSuccess'
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
                  'purchaseRequests.statusUpdateFailed'
                )
              )
            );
          }
      });
  }
}
