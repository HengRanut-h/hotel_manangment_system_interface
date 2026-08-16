import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import {
  finalize
} from 'rxjs';

import {
  takeUntilDestroyed
} from '@angular/core/rxjs-interop';

import {
  LucideArrowLeft,
  LucideCreditCard,
  LucideCircleDollarSign,
  LucideReceiptText,
  LucideUserRound,
  LucideClock3,
  LucideFileText
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  Payment
} from '../../models/payment.model';

import {
  PaymentsApiService
} from '../../data-access/payments-api.service';

import {
  PaymentMethodBadgeComponent
} from '../../components/payment-method-badge/payment-method-badge.component';

import {
  PaymentStatusBadgeComponent
} from '../../components/payment-status-badge/payment-status-badge.component';

@Component({
  selector:
    'app-payments-detail-page',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,
    TranslationPipe,

    PaymentMethodBadgeComponent,
    PaymentStatusBadgeComponent,

    LucideArrowLeft,
    LucideCreditCard,
    LucideCircleDollarSign,
    LucideReceiptText,
    LucideUserRound,
    LucideClock3,
    LucideFileText
  ],

  templateUrl:
    './payments-detail.page.html',

  styleUrl:
    './payments-detail.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class PaymentsDetailPage {

  private readonly api =
    inject(PaymentsApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly payment =
    signal<Payment | null>(
      null
    );

  readonly loading =
    signal(false);

  readonly errorKey =
    signal<string | null>(
      null
    );

  constructor() {

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

      this.errorKey.set(
        'payments.errors.missingId'
      );

      return;
    }

    this.load(
      id
    );
  }

  load(
    id: string
  ): void {

    this.loading.set(
      true
    );

    this.errorKey.set(
      null
    );

    this.api
      .getById(
        id
      )
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        ),

        finalize(
          () =>
            this.loading.set(
              false
            )
        )
      )
      .subscribe({
        next:
          payment =>
            this.payment.set(
              payment
            ),

        error:
          error => {

            console.error(
              'Payment detail API error',
              error
            );

            this.errorKey.set(
              'payments.errors.loadDetail'
            );
          }
      });
  }
}
