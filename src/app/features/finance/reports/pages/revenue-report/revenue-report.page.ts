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
  FormsModule
} from '@angular/forms';

import {
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
  LucideCircleDollarSign,
  LucideRefreshCw,
  LucideSearch,
  LucideReceiptText,
  LucideWalletCards,
  LucideCalendarDays
} from '@lucide/angular';

import {
  RevenueReport
} from '../../models/report.model';

import {
  ReportsApiService
} from '../../data-access/reports-api.service';

import {
  PaymentMethodBadgeComponent
} from '../../components/payment-method-badge/payment-method-badge.component';

@Component({
  selector:
    'app-revenue-report-page',

  standalone:
    true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    PaymentMethodBadgeComponent,

    LucideArrowLeft,
    LucideCircleDollarSign,
    LucideRefreshCw,
    LucideSearch,
    LucideReceiptText,
    LucideWalletCards,
    LucideCalendarDays
  ],

  templateUrl:
    './revenue-report.page.html',

  styleUrl:
    './revenue-report.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class RevenueReportPage {

  private readonly api =
    inject(ReportsApiService);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly from =
    signal(
      this.firstDayOfMonth()
    );

  readonly to =
    signal(
      this.today()
    );

  readonly data =
    signal<RevenueReport | null>(
      null
    );

  readonly loading =
    signal(false);

  readonly error =
    signal(false);

  readonly validationError =
    signal('');

  constructor() {
    this.load();
  }

  load(): void {

    this.validationError.set(
      ''
    );

    this.error.set(
      false
    );

    const from =
      this.from();

    const to =
      this.to();

    if (
      !from ||
      !to
    ) {
      this.validationError.set(
        'From and To dates are required.'
      );

      return;
    }

    if (
      to < from
    ) {
      this.validationError.set(
        "The 'to' date cannot be earlier than the 'from' date."
      );

      return;
    }

    this.loading.set(
      true
    );

    this.api
      .getRevenue({
        from,
        to
      })
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
          data =>
            this.data.set(
              data
            ),

        error:
          error => {

            console.error(
              'Revenue report API error',
              error
            );

            this.error.set(
              true
            );
          }
      });
  }

  private today(): string {

    const date =
      new Date();

    const local =
      new Date(
        date.getTime() -
        date.getTimezoneOffset() *
        60000
      );

    return local
      .toISOString()
      .slice(
        0,
        10
      );
  }

  private firstDayOfMonth(): string {

    const now =
      new Date();

    const first =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );

    const local =
      new Date(
        first.getTime() -
        first.getTimezoneOffset() *
        60000
      );

    return local
      .toISOString()
      .slice(
        0,
        10
      );
  }
}
