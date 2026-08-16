
import {
  DecimalPipe
} from '@angular/common';

import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';

import {
  RouterLink
} from '@angular/router';

import {
  LucideArrowLeft,
  LucideCheckCircle2,
  LucideCircleDollarSign,
  LucideClipboardList,
  LucideRefreshCw,
  LucideWalletCards
} from '@lucide/angular';

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
  InvoicesApiService
} from '../../data-access/invoices-api.service';

import {
  Invoice
} from '../../models/invoice.model';

@Component({
  selector: 'app-invoices-analytics-page',
  standalone: true,
  imports: [
    DecimalPipe,
    RouterLink,
    TranslationPipe,
    SpinComponent,
    LucideArrowLeft,
    LucideCheckCircle2,
    LucideCircleDollarSign,
    LucideClipboardList,
    LucideRefreshCw,
    LucideWalletCards
  ],
  templateUrl: './invoices-analytics.page.html',
  styleUrl: './invoices-analytics.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoicesAnalyticsPage
  implements OnInit {

  private readonly api =
    inject(InvoicesApiService);

  private readonly translation =
    inject(TranslationService);

  readonly items = signal<Invoice[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal('');

  readonly totalBilled = computed(
    () => this.sum('totalAmount')
  );

  readonly totalPaid = computed(
    () => this.sum('paidAmount')
  );

  readonly totalOutstanding = computed(
    () =>
      this.items().reduce(
        (total, invoice) =>
          total +
          Math.max(
            0,
            invoice.balanceAmount
          ),
        0
      )
  );

  readonly averageInvoice = computed(
    () =>
      this.items().length > 0
        ? this.totalBilled() /
          this.items().length
        : 0
  );

  readonly collectionRate = computed(
    () =>
      this.totalBilled() > 0
        ? Math.min(
            100,
            (
              this.totalPaid() /
              this.totalBilled()
            ) * 100
          )
        : 0
  );

  readonly paidCount = computed(
    () =>
      this.items().filter(
        invoice =>
          invoice.balanceAmount <= 0
      ).length
  );

  readonly outstandingCount = computed(
    () =>
      this.items().filter(
        invoice =>
          invoice.balanceAmount > 0
      ).length
  );

  readonly overdueCount = computed(
    () =>
      this.items().filter(
        invoice =>
          this.isOverdue(invoice)
      ).length
  );

  readonly statusRows = computed(
    () => {
      const map =
        new Map<
          string,
          {
            status: string;
            count: number;
            amount: number;
          }
        >();

      for (const invoice of this.items()) {
        const status =
          invoice.status.trim() || 'Unknown';

        const current =
          map.get(status) ?? {
            status,
            count: 0,
            amount: 0
          };

        current.count += 1;
        current.amount +=
          invoice.totalAmount;

        map.set(status, current);
      }

      return Array.from(
        map.values()
      ).sort(
        (left, right) =>
          right.count - left.count
      );
    }
  );

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.api.getAll().subscribe({
      next: result => {
        this.items.set(result.items);
        this.loading.set(false);
      },

      error: error => {
        this.errorMessage.set(
          getSafeApiErrorMessage(
            error,
            this.translation.translate(
              'invoices.loadFailed'
            )
          )
        );
        this.loading.set(false);
      }
    });
  }

  statusPercentage(
    count: number
  ): number {
    if (this.items().length <= 0) {
      return 0;
    }

    return (
      count /
      this.items().length
    ) * 100;
  }

  private sum(
    field:
      'totalAmount' |
      'paidAmount'
  ): number {
    return this.items().reduce(
      (total, invoice) =>
        total + invoice[field],
      0
    );
  }

  private isOverdue(
    invoice: Invoice
  ): boolean {
    if (
      invoice.balanceAmount <= 0 ||
      !invoice.dueDate
    ) {
      return false;
    }

    const due =
      new Date(
        `${invoice.dueDate.slice(0, 10)}T00:00:00`
      );

    const now = new Date();

    const today =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );

    return (
      !Number.isNaN(due.getTime()) &&
      due.getTime() < today.getTime()
    );
  }
}
