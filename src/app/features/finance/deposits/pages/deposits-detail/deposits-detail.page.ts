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
  LucideLandmark,
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
  Deposit
} from '../../models/deposit.model';

import {
  DepositsApiService
} from '../../data-access/deposits-api.service';

import {
  DepositStatusBadgeComponent
} from '../../components/deposit-status-badge/deposit-status-badge.component';

import {
  DepositTypeBadgeComponent
} from '../../components/deposit-type-badge/deposit-type-badge.component';

@Component({
  selector:
    'app-deposits-detail-page',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,
    TranslationPipe,

    DepositStatusBadgeComponent,
    DepositTypeBadgeComponent,

    LucideArrowLeft,
    LucideLandmark,
    LucideCircleDollarSign,
    LucideReceiptText,
    LucideUserRound,
    LucideClock3,
    LucideFileText
  ],

  templateUrl:
    './deposits-detail.page.html',

  styleUrl:
    './deposits-detail.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class DepositsDetailPage {

  private readonly api =
    inject(DepositsApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly deposit =
    signal<Deposit | null>(
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
        'deposits.errors.missingId'
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
          deposit =>
            this.deposit.set(
              deposit
            ),

        error:
          error => {

            console.error(
              'Deposit detail API error',
              error
            );

            this.errorKey.set(
              'deposits.errors.loadDetail'
            );
          }
      });
  }
}
