
import {
  DatePipe,
  DecimalPipe
} from '@angular/common';

import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';

import {
  RouterLink
} from '@angular/router';

import {
  LucideCalendarDays,
  LucideCheckCircle2,
  LucideChevronLeft,
  LucideChevronRight,
  LucideCirclePlus,
  LucideClipboardList,
  LucideEye,
  LucideRefreshCw,
  LucideSearch,
  LucideX
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
  InvoiceStatusBadgeComponent
} from '../../components/invoice-status-badge/invoice-status-badge.component';

import {
  InvoicesApiService
} from '../../data-access/invoices-api.service';

import {
  Invoice
} from '../../models/invoice.model';

@Component({
  selector: 'app-invoices-list-page',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe,
    RouterLink,
    TranslationPipe,
    SpinComponent,
    InvoiceStatusBadgeComponent,
    LucideCalendarDays,
    LucideCheckCircle2,
    LucideChevronLeft,
    LucideChevronRight,
    LucideCirclePlus,
    LucideClipboardList,
    LucideEye,
    LucideRefreshCw,
    LucideSearch,
    LucideX
  ],
  templateUrl: './invoices-list.page.html',
  styleUrl: './invoices-list.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoicesListPage
  implements OnInit, OnDestroy {

  readonly auth = inject(AuthStore);

  private readonly api =
    inject(InvoicesApiService);

  private readonly translation =
    inject(TranslationService);

  readonly items = signal<Invoice[]>([]);
  readonly backendTotalItems = signal(0);
  readonly loading = signal(true);
  readonly refreshing = signal(false);
  readonly errorMessage = signal('');
  readonly lastUpdated = signal<Date | null>(null);

  readonly search = signal('');
  readonly status = signal('');
  readonly dueState = signal<
    'all' |
    'outstanding' |
    'overdue' |
    'dueSoon' |
    'paid'
  >('all');

  readonly invoiceFrom = signal('');
  readonly invoiceTo = signal('');
  readonly pageNumber = signal(1);
  readonly pageSize = signal(10);

  private refreshTimer:
    ReturnType<typeof setInterval> | null = null;

  readonly statusOptions = computed(
    () =>
      Array.from(
        new Set(
          this.items()
            .map(invoice => invoice.status.trim())
            .filter(Boolean)
        )
      ).sort((a, b) => a.localeCompare(b))
  );

  readonly filteredItems = computed(
    () => {
      const search =
        this.search().trim().toLowerCase();

      const status =
        this.status().trim().toLowerCase();

      const from = this.invoiceFrom();
      const to = this.invoiceTo();
      const dueState = this.dueState();

      return this.items().filter(invoice => {
        if (
          search &&
          ![
            invoice.invoiceNumber,
            invoice.guestName,
            invoice.status,
            invoice.reservationId ?? ''
          ]
            .join(' ')
            .toLowerCase()
            .includes(search)
        ) {
          return false;
        }

        if (
          status &&
          invoice.status.trim().toLowerCase() !== status
        ) {
          return false;
        }

        if (
          from &&
          invoice.invoiceDate &&
          invoice.invoiceDate < from
        ) {
          return false;
        }

        if (
          to &&
          invoice.invoiceDate &&
          invoice.invoiceDate > to
        ) {
          return false;
        }

        switch (dueState) {
          case 'outstanding':
            return invoice.balanceAmount > 0;
          case 'overdue':
            return this.isOverdue(invoice);
          case 'dueSoon':
            return this.isDueSoon(invoice);
          case 'paid':
            return invoice.balanceAmount <= 0;
          default:
            return true;
        }
      });
    }
  );

  readonly totalPages = computed(
    () =>
      Math.max(
        1,
        Math.ceil(
          this.filteredItems().length /
          Math.max(1, this.pageSize())
        )
      )
  );

  readonly pagedItems = computed(
    () => {
      const page =
        Math.min(
          this.pageNumber(),
          this.totalPages()
        );

      const start =
        (page - 1) * this.pageSize();

      return this.filteredItems().slice(
        start,
        start + this.pageSize()
      );
    }
  );

  readonly totalBilled = computed(
    () =>
      this.items().reduce(
        (total, invoice) =>
          total + invoice.totalAmount,
        0
      )
  );

  readonly totalPaid = computed(
    () =>
      this.items().reduce(
        (total, invoice) =>
          total + invoice.paidAmount,
        0
      )
  );

  readonly totalOutstanding = computed(
    () =>
      this.items().reduce(
        (total, invoice) =>
          total +
          Math.max(0, invoice.balanceAmount),
        0
      )
  );

  readonly paidCount = computed(
    () =>
      this.items().filter(
        invoice => invoice.balanceAmount <= 0
      ).length
  );

  readonly partialCount = computed(
    () =>
      this.items().filter(
        invoice =>
          this.normalizeStatus(invoice.status) ===
          'partiallypaid'
      ).length
  );

  readonly overdueCount = computed(
    () =>
      this.items().filter(
        invoice => this.isOverdue(invoice)
      ).length
  );

  readonly hasFilters = computed(
    () =>
      Boolean(
        this.search().trim() ||
        this.status().trim() ||
        this.dueState() !== 'all' ||
        this.invoiceFrom() ||
        this.invoiceTo()
      )
  );

  readonly hasPreviousPage = computed(
    () => this.pageNumber() > 1
  );

  readonly hasNextPage = computed(
    () =>
      this.pageNumber() <
      this.totalPages()
  );

  ngOnInit(): void {
    this.load();

    this.refreshTimer = setInterval(
      () => this.load(true),
      60_000
    );
  }

  ngOnDestroy(): void {
    if (this.refreshTimer !== null) {
      clearInterval(this.refreshTimer);
    }
  }

  load(silent = false): void {
    if (silent) {
      this.refreshing.set(true);
    } else {
      this.loading.set(true);
    }

    this.errorMessage.set('');

    this.api.getAll().subscribe({
      next: result => {
        this.items.set(result.items);
        this.backendTotalItems.set(
          result.totalItems
        );
        this.lastUpdated.set(new Date());
        this.loading.set(false);
        this.refreshing.set(false);

        if (
          this.pageNumber() >
          this.totalPages()
        ) {
          this.pageNumber.set(
            this.totalPages()
          );
        }
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
        this.refreshing.set(false);
      }
    });
  }

  refresh(): void {
    if (this.loading() || this.refreshing()) {
      return;
    }
    this.load(true);
  }

  setSearch(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      this.search.set(target.value);
      this.pageNumber.set(1);
    }
  }

  setStatus(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLSelectElement) {
      this.status.set(target.value);
      this.pageNumber.set(1);
    }
  }

  setDueState(event: Event): void {
    const target = event.target;

    if (!(target instanceof HTMLSelectElement)) {
      return;
    }

    switch (target.value) {
      case 'outstanding':
      case 'overdue':
      case 'dueSoon':
      case 'paid':
        this.dueState.set(target.value);
        break;
      default:
        this.dueState.set('all');
        break;
    }

    this.pageNumber.set(1);
  }

  setInvoiceFrom(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      this.invoiceFrom.set(target.value);
      this.pageNumber.set(1);
    }
  }

  setInvoiceTo(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      this.invoiceTo.set(target.value);
      this.pageNumber.set(1);
    }
  }

  clearFilters(): void {
    this.search.set('');
    this.status.set('');
    this.dueState.set('all');
    this.invoiceFrom.set('');
    this.invoiceTo.set('');
    this.pageNumber.set(1);
  }

  previousPage(): void {
    if (!this.hasPreviousPage()) {
      return;
    }

    this.pageNumber.update(
      value => Math.max(1, value - 1)
    );
  }

  nextPage(): void {
    if (!this.hasNextPage()) {
      return;
    }

    this.pageNumber.update(
      value => value + 1
    );
  }

  isOverdue(invoice: Invoice): boolean {
    if (
      invoice.balanceAmount <= 0 ||
      !invoice.dueDate
    ) {
      return false;
    }

    const due =
      this.dateOnly(invoice.dueDate);

    const today = this.today();

    return (
      due !== null &&
      due.getTime() < today.getTime()
    );
  }

  isDueSoon(invoice: Invoice): boolean {
    if (
      invoice.balanceAmount <= 0 ||
      !invoice.dueDate
    ) {
      return false;
    }

    const due =
      this.dateOnly(invoice.dueDate);

    if (!due) {
      return false;
    }

    const today = this.today();
    const upper = new Date(today);
    upper.setDate(upper.getDate() + 3);

    return (
      due.getTime() >= today.getTime() &&
      due.getTime() <= upper.getTime()
    );
  }

  dueLabelKey(invoice: Invoice): string {
    if (invoice.balanceAmount <= 0) {
      return 'invoices.settled';
    }

    if (this.isOverdue(invoice)) {
      return 'invoices.overdue';
    }

    if (this.isDueSoon(invoice)) {
      return 'invoices.dueSoon';
    }

    return 'invoices.outstanding';
  }

  private normalizeStatus(
    value: string | null | undefined
  ): string {
    return (value ?? '')
      .trim()
      .toLowerCase()
      .replace(/[\s_-]+/g, '');
  }

  private dateOnly(value: string): Date | null {
    const normalized =
      value.length >= 10
        ? value.slice(0, 10)
        : value;

    const result =
      new Date(`${normalized}T00:00:00`);

    return Number.isNaN(result.getTime())
      ? null
      : result;
  }

  private today(): Date {
    const now = new Date();

    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
  }
}
