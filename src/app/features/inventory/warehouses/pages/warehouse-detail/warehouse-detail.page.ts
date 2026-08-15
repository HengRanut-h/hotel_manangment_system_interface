import {
  DatePipe
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
  Router,
  RouterLink
} from '@angular/router';

import {
  LucideArrowLeft,
  LucidePencil,
  LucideWarehouse
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
    'app-warehouse-detail-page',

  standalone:
    true,

  imports: [
    DatePipe,
    RouterLink,
    TranslationPipe,
    SpinComponent,
    WarehouseStatusBadgeComponent,
    LucideArrowLeft,
    LucidePencil,
    LucideWarehouse
  ],

  templateUrl:
    './warehouse-detail.page.html',

  styleUrl:
    './warehouse-detail.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class WarehouseDetailPage
  implements OnInit {

  readonly auth =
    inject(AuthStore);

  private readonly api =
    inject(WarehousesApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly translation =
    inject(TranslationService);

  readonly warehouse =
    signal<Warehouse | null>(null);

  readonly loading =
    signal(true);

  readonly errorMessage =
    signal('');

  ngOnInit(): void {

    this.load();
  }

  load(): void {

    const id =
      this.route.snapshot
        .paramMap
        .get('id');

    if (!id) {
      void this.router.navigate([
        '/app/inventory/warehouses'
      ]);
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.api
      .getById(id)
      .subscribe({

        next:
          warehouse => {

            this.warehouse.set(
              warehouse
            );

            this.loading.set(false);
          },

        error:
          error => {

            this.errorMessage.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'warehouses.detailLoadFailed'
                )
              )
            );

            this.loading.set(false);
          }
      });
  }
}
