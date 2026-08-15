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
  LucideTruck
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
    'app-supplier-detail-page',

  standalone:
    true,

  imports: [
    DatePipe,
    RouterLink,
    TranslationPipe,
    SpinComponent,
    SupplierStatusBadgeComponent,
    LucideArrowLeft,
    LucidePencil,
    LucideTruck
  ],

  templateUrl:
    './supplier-detail.page.html',

  styleUrl:
    './supplier-detail.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class SupplierDetailPage
  implements OnInit {

  readonly auth =
    inject(AuthStore);

  private readonly api =
    inject(SuppliersApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly translation =
    inject(TranslationService);

  readonly supplier =
    signal<Supplier | null>(null);

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
        '/app/inventory/suppliers'
      ]);
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.api
      .getById(id)
      .subscribe({

        next:
          supplier => {

            this.supplier.set(
              supplier
            );

            this.loading.set(false);
          },

        error:
          error => {

            this.errorMessage.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'suppliers.detailLoadFailed'
                )
              )
            );

            this.loading.set(false);
          }
      });
  }
}
