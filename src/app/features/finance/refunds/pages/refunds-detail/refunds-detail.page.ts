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
  LucideRotateCcw,
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
  Refund
} from '../../models/refund.model';

import {
  RefundsApiService
} from '../../data-access/refunds-api.service';

import {
  RefundStatusBadgeComponent
} from '../../components/refund-status-badge/refund-status-badge.component';

import {
  RefundReasonBadgeComponent
} from '../../components/refund-reason-badge/refund-reason-badge.component';

@Component({
  selector:
    'app-refunds-detail-page',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,
    TranslationPipe,

    RefundStatusBadgeComponent,
    RefundReasonBadgeComponent,

    LucideArrowLeft,
    LucideRotateCcw,
    LucideCircleDollarSign,
    LucideReceiptText,
    LucideUserRound,
    LucideClock3,
    LucideFileText
  ],

  templateUrl:
    './refunds-detail.page.html',

  styleUrl:
    './refunds-detail.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class RefundsDetailPage {

  private readonly api =
    inject(RefundsApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly refund =
    signal<Refund | null>(
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
        'refunds.errors.missingId'
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
          refund =>
            this.refund.set(
              refund
            ),

        error:
          error => {

            console.error(
              'Refund detail API error',
              error
            );

            this.errorKey.set(
              'refunds.errors.loadDetail'
            );
          }
      });
  }
}
