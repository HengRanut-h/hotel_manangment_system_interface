import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  LucideCirclePlus,
  LucidePencil,
  LucideRefreshCw,
  LucideSearch,
  LucideTrash2
} from '@lucide/angular';
import { ModalComponent } from '../ui/modal/modal.component';
import { PagerComponent } from '../ui/pager/pager.component';
import { StatusBadgeComponent } from '../ui/status-badge/status-badge.component';
import { ToastService } from '../ui/toast/toast.service';
import { ResourceApiService } from './resource-api.service';
import { ResourceField, ResourceRow } from './resource.models';
import { RESOURCE_REGISTRY } from './resource.registry';

@Component({
  selector: 'app-resource-page',
  standalone: true,
  imports: [
    FormsModule,
    LucideCirclePlus,
    LucidePencil,
    LucideRefreshCw,
    LucideSearch,
    LucideTrash2,
    ModalComponent,
    PagerComponent,
    StatusBadgeComponent
  ],
  templateUrl: './resource-page.component.html',
  styleUrl: './resource-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourcePageComponent implements OnInit {
  readonly resource = input.required<string>();

  private readonly api = inject(ResourceApiService);
  private readonly toast = inject(ToastService);

  readonly loading = signal(false);
  readonly mutatingId = signal<string | null>(null);
  readonly rows = signal<ResourceRow[]>([]);

  readonly page = signal(1);
  readonly pageSize = signal(20);
  readonly total = signal(0);

  readonly search = signal('');
  readonly status = signal('');
  readonly activeFilter = signal('');
  readonly sortBy = signal('');
  readonly sortDirection = signal<'asc' | 'desc'>('asc');

  readonly modalOpen = signal(false);
  readonly detailOpen = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly detail = signal<ResourceRow | null>(null);
  readonly form = signal<ResourceRow>({});

  readonly config = computed(() => RESOURCE_REGISTRY[this.resource()]);

  readonly tableFields = computed(
    () => this.config()?.fields.filter(field => field.table) ?? []
  );

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.total() / Math.max(this.pageSize(), 1)))
  );

  // =========================================================
  // INITIALIZE
  // =========================================================

  ngOnInit(): void {
    const config = this.config();

    this.sortBy.set(config?.kind === 'operational' ? 'createdAt' : 'name');
    this.sortDirection.set(config?.kind === 'operational' ? 'desc' : 'asc');

    this.load();
  }

  // =========================================================
  // GET ALL
  // =========================================================

  load(): void {
    const config = this.config();

    if (!config) {
      return;
    }

    this.loading.set(true);

    this.api
      .list(
        config,
        this.page(),
        this.pageSize(),
        this.search(),
        this.status(),
        this.activeFilter(),
        this.sortBy(),
        this.sortDirection()
      )
      .subscribe({
        next: response => {
          this.rows.set(response.items);
          this.total.set(response.totalItems);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        }
      });
  }

  // =========================================================
  // GET BY ID / VIEW DETAILS
  // =========================================================

  view(row: ResourceRow): void {
    const config = this.config();
    const id = String(row.id ?? '');

    if (!config || !id) {
      return;
    }

    this.mutatingId.set(id);

    this.api.getById(config, id).subscribe({
      next: response => {
        this.detail.set(response);
        this.detailOpen.set(true);
        this.mutatingId.set(null);
      },
      error: () => {
        this.mutatingId.set(null);
      }
    });
  }

  // =========================================================
  // SEARCH
  // =========================================================

  setSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
    this.page.set(1);
    this.load();
  }

  // =========================================================
  // STATUS FILTER
  // =========================================================

  setStatus(event: Event): void {
    this.status.set((event.target as HTMLSelectElement).value);
    this.page.set(1);
    this.load();
  }

  // =========================================================
  // ACTIVE FILTER
  // =========================================================

  setActiveFilter(event: Event): void {
    this.activeFilter.set((event.target as HTMLSelectElement).value);
    this.page.set(1);
    this.load();
  }

  // =========================================================
  // SORT
  // =========================================================

  setSort(event: Event): void {
    this.sortBy.set((event.target as HTMLSelectElement).value);
    this.page.set(1);
    this.load();
  }

  toggleSortDirection(): void {
    this.sortDirection.update(direction =>
      direction === 'asc' ? 'desc' : 'asc'
    );

    this.page.set(1);
    this.load();
  }

  // =========================================================
  // PAGE SIZE
  // =========================================================

  setPageSize(event: Event): void {
    this.pageSize.set(Number((event.target as HTMLSelectElement).value));
    this.page.set(1);
    this.load();
  }

  // =========================================================
  // PAGINATION
  // =========================================================

  changePage(pageNumber: number): void {
    this.page.set(pageNumber);
    this.load();
  }

  // =========================================================
  // CREATE
  // =========================================================

  create(): void {
    const config = this.config();

    if (!config || config.canCreate === false) {
      return;
    }

    this.editingId.set(null);

    const initial: ResourceRow = {};

    for (const field of config.fields) {
      if (field.editable === false) {
        continue;
      }

      initial[field.key] =
        field.type === 'boolean'
          ? true
          : field.type === 'number'
            ? 0
            : '';
    }

    if (config.kind === 'operational') {
      initial['status'] = 'Open';
      initial['eventAtUtc'] = this.toLocalDateTime(new Date());
    }

    this.form.set(initial);
    this.modalOpen.set(true);
  }

  // =========================================================
  // EDIT
  // =========================================================

  edit(row: ResourceRow): void {
    const config = this.config();

    if (!config || config.canEdit === false) {
      return;
    }

    this.editingId.set(String(row.id ?? ''));

    const form = { ...row };

    for (const field of config.fields) {
      if (field.type === 'datetime' && form[field.key]) {
        form[field.key] = this.toLocalDateTime(
          new Date(String(form[field.key]))
        );
      }
    }

    this.form.set(form);
    this.modalOpen.set(true);
  }

  // =========================================================
  // FORM VALUE
  // =========================================================

  value(key: string): string | number | boolean | null | undefined {
    return this.form()[key] as
      | string
      | number
      | boolean
      | null
      | undefined;
  }

  setValue(field: ResourceField, event: Event): void {
    const target = event.target as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement;

    let value: string | number | boolean = target.value;

    if (field.type === 'boolean') {
      value = (target as HTMLInputElement).checked;
    }

    if (field.type === 'number') {
      value = Number(target.value);
    }

    this.form.update(form => ({
      ...form,
      [field.key]: value
    }));
  }

  // =========================================================
  // SAVE
  // =========================================================

  save(): void {
    const config = this.config();

    if (!config) {
      return;
    }

    const id = this.editingId();
    const body = this.toRequestBody(this.form());

    const request = id
      ? this.api.update(config, id, body)
      : this.api.create(config, body);

    request.subscribe(() => {
      this.toast.success(
        `${config.singular} ${id ? 'updated' : 'created'} successfully`
      );

      this.modalOpen.set(false);
      this.load();
    });
  }

  // =========================================================
  // CHANGE STATUS
  // =========================================================

  changeStatus(row: ResourceRow, event: Event): void {
    const config = this.config();
    const id = String(row.id ?? '');
    const status = (event.target as HTMLSelectElement).value;

    if (!config || !id || !status || !config.supportsStatus) {
      return;
    }

    this.mutatingId.set(id);

    this.api.status(config, id, status).subscribe({
      next: () => {
        this.toast.success(`${config.singular} status changed to ${status}`);
        this.mutatingId.set(null);
        this.load();
      },
      error: () => {
        this.mutatingId.set(null);
        (event.target as HTMLSelectElement).value = String(row.status ?? '');
      }
    });
  }

  // =========================================================
  // ACTIVE / INACTIVE
  // =========================================================

  toggleActive(row: ResourceRow): void {
    const config = this.config();
    const id = String(row.id ?? '');

    if (!config || !id || !config.supportsActive) {
      return;
    }

    const isActive = !Boolean(row.isActive);

    this.mutatingId.set(id);

    this.api.active(config, id, isActive).subscribe({
      next: () => {
        this.toast.success(
          `${config.singular} ${isActive ? 'activated' : 'deactivated'} successfully`
        );

        this.mutatingId.set(null);
        this.load();
      },
      error: () => {
        this.mutatingId.set(null);
      }
    });
  }

  // =========================================================
  // DELETE
  // =========================================================

  remove(row: ResourceRow): void {
    const config = this.config();
    const id = String(row.id ?? '');

    if (
      !config ||
      !id ||
      config.canDelete === false ||
      !confirm(`Delete this ${config.singular.toLowerCase()}?`)
    ) {
      return;
    }

    this.mutatingId.set(id);

    this.api.delete(config, id).subscribe({
      next: () => {
        this.toast.success(`${config.singular} deleted successfully`);
        this.mutatingId.set(null);

        if (this.rows().length === 1 && this.page() > 1) {
          this.page.update(pageNumber => pageNumber - 1);
        }

        this.load();
      },
      error: () => {
        this.mutatingId.set(null);
      }
    });
  }

  // =========================================================
  // RESTORE
  // =========================================================

  restore(row: ResourceRow): void {
    const config = this.config();
    const id = String(row.id ?? '');

    if (!config || !id || !config.supportsRestore) {
      return;
    }

    this.mutatingId.set(id);

    this.api.restore(config, id).subscribe({
      next: () => {
        this.toast.success(`${config.singular} restored successfully`);
        this.mutatingId.set(null);
        this.load();
      },
      error: () => {
        this.mutatingId.set(null);
      }
    });
  }

  // =========================================================
  // EXPORT CURRENT PAGE
  // =========================================================

  exportCsv(): void {
    const config = this.config();

    if (!config || config.canExport === false || this.rows().length === 0) {
      return;
    }

    const fields = this.tableFields();
    const escape = (value: unknown) =>
      `"${String(value ?? '').replaceAll('"', '""')}"`;

    const lines = [
      fields.map(field => escape(field.label)).join(','),
      ...this.rows().map(row =>
        fields
          .map(field => escape(this.display(row, field)))
          .join(',')
      )
    ];

    const blob = new Blob([lines.join('\r\n')], {
      type: 'text/csv;charset=utf-8'
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = `${config.key}-page-${this.page()}.csv`;
    anchor.click();

    URL.revokeObjectURL(url);
  }

  // =========================================================
  // DETAIL ENTRIES
  // =========================================================

  detailEntries(): Array<{ label: string; value: string }> {
    const config = this.config();
    const detail = this.detail();

    if (!config || !detail) {
      return [];
    }

    const entries = config.fields.map(field => ({
      label: field.label,
      value: this.display(detail, field)
    }));

    const metadata: Array<[string, string]> = [
      ['ID', String(detail['id'] ?? '')],
      ['Hotel ID', String(detail['hotelId'] ?? '')],
      ['Branch ID', String(detail['branchId'] ?? '')],
      ['Created', String(detail['createdAtUtc'] ?? '')]
    ];

    for (const [label, raw] of metadata) {
      if (!raw) {
        continue;
      }

      let value = raw;

      if (label === 'Created') {
        const date = new Date(raw);
        value = Number.isNaN(date.getTime()) ? raw : date.toLocaleString();
      }

      entries.push({ label, value });
    }

    return entries;
  }

  // =========================================================
  // DISPLAY
  // =========================================================

  display(row: ResourceRow, field: ResourceField): string {
    const value = row[field.key];

    if (value === null || value === undefined || value === '') {
      return '—';
    }

    if (field.type === 'boolean') {
      return value ? 'Yes' : 'No';
    }

    if (
      field.type === 'number' &&
      (field.key.toLowerCase().includes('amount') ||
        field.key.toLowerCase().includes('rate'))
    ) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(Number(value));
    }

    if (field.type === 'datetime' || field.type === 'date') {
      const date = new Date(String(value));
      return Number.isNaN(date.getTime())
        ? String(value)
        : date.toLocaleString();
    }

    return String(value);
  }

  // =========================================================
  // REQUEST BODY
  // =========================================================

  private toRequestBody(form: ResourceRow): ResourceRow {
    const config = this.config();
    const body = { ...form };

    delete body['id'];
    delete body['hotelId'];
    delete body['createdAtUtc'];
    delete body['referenceNumber'];
    delete body['isDeleted'];

    if (config?.kind === 'operational') {
      if (body['eventAtUtc']) {
        body['eventAtUtc'] = new Date(String(body['eventAtUtc'])).toISOString();
      }

      body['relatedEntityId'] = body['relatedEntityId'] || null;
      body['relatedEntityType'] = body['relatedEntityType'] || null;
      body['notes'] = body['notes'] || null;
    }

    if (config?.kind === 'catalog') {
      body['description'] = body['description'] || null;
    }

    return body;
  }

  // =========================================================
  // LOCAL DATETIME
  // =========================================================

  private toLocalDateTime(date: Date): string {
    const local = new Date(
      date.getTime() - date.getTimezoneOffset() * 60_000
    );

    return local.toISOString().slice(0, 16);
  }
}
