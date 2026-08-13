import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  takeUntilDestroyed
} from '@angular/core/rxjs-interop';

import {
  Router
} from '@angular/router';

import {
  LucideChevronLeft,
  LucideChevronRight,
  LucideCirclePlus,
  LucideLayers,
  LucideList,
  LucidePencil,
  LucideRefreshCw,
  LucideSearch,
  LucideShield,
  LucideShieldCheck,
  LucideTrash2,
  LucideX
} from '@lucide/angular';

import {
  debounceTime,
  distinctUntilChanged,
  Subject
} from 'rxjs';

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
  PageHeaderComponent
} from '../../../../../shared/ui/page-header/page-header.component';

import {
  SpinComponent
} from '../../../../../shared/ui/spin/spin.component';

import {
  ToastService
} from '../../../../../shared/ui/toast/toast.service';

import {
  PermissionApiService
} from '../../data-access/permission-api.service';

import {
  Permission,
  PermissionGroup
} from '../../models/permission.model';

@Component({
  selector: 'app-permission-list-page',
  standalone: true,
  imports: [
    TranslationPipe,
    PageHeaderComponent,
    SpinComponent,
    LucideChevronLeft,
    LucideChevronRight,
    LucideCirclePlus,
    LucideLayers,
    LucideList,
    LucidePencil,
    LucideRefreshCw,
    LucideSearch,
    LucideShield,
    LucideShieldCheck,
    LucideTrash2,
    LucideX
  ],
  templateUrl: './permission-list.page.html',
  styleUrl: './permission-list.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionListPage implements OnInit {
  private readonly api = inject(PermissionApiService);
  private readonly router = inject(Router);
  private readonly translation = inject(TranslationService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly searchChanges = new Subject<string>();

  readonly permissions = signal<Permission[]>([]);
  readonly search = signal('');
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly deletingId = signal<string | null>(null);

  readonly pageNumber = signal(1);
  readonly pageSize = signal(20);
  readonly totalItems = signal(0);
  readonly totalPages = signal(0);
  readonly hasPreviousPage = signal(false);
  readonly hasNextPage = signal(false);

  readonly groups = computed<PermissionGroup[]>(() => {
    const groupMap = new Map<string, Permission[]>();

    for (const permission of this.permissions()) {
      const groupName = permission.name.split('.')[0].trim() || 'other';
      const current = groupMap.get(groupName) ?? [];
      current.push(permission);
      groupMap.set(groupName, current);
    }

    return Array.from(groupMap.entries())
      .map(([name, permissions]) => ({
        name,
        permissions: [...permissions].sort((a, b) =>
          a.name.localeCompare(b.name)
        )
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  readonly currentPageCount = computed(() => this.permissions().length);
  readonly groupCount = computed(() => this.groups().length);

  readonly startItem = computed(() => {
    if (this.totalItems() === 0) {
      return 0;
    }

    return ((this.pageNumber() - 1) * this.pageSize()) + 1;
  });

  readonly endItem = computed(() => {
    if (this.totalItems() === 0) {
      return 0;
    }

    return Math.min(
      this.pageNumber() * this.pageSize(),
      this.totalItems()
    );
  });

  ngOnInit(): void {
    this.searchChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.pageNumber.set(1);
        this.loadPage();
      });

    this.loadPage();
  }

  load(): void {
    this.loadPage();
  }

  private loadPage(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.api.getPage({
      search: this.search().trim() || undefined,
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize(),
      sortBy: 'name',
      sortDirection: 'asc'
    }).subscribe({
      next: response => {
        this.permissions.set(
          Array.isArray(response.items) ? response.items : []
        );
        this.pageNumber.set(Number(response.pageNumber ?? 1));
        this.pageSize.set(Number(response.pageSize ?? 20));
        this.totalItems.set(Number(response.totalItems ?? 0));
        this.totalPages.set(Number(response.totalPages ?? 0));
        this.hasPreviousPage.set(Boolean(response.hasPreviousPage));
        this.hasNextPage.set(Boolean(response.hasNextPage));
        this.loading.set(false);
      },

      error: error => {
        this.permissions.set([]);
        this.totalItems.set(0);
        this.totalPages.set(0);
        this.hasPreviousPage.set(false);
        this.hasNextPage.set(false);
        this.errorMessage.set(
          getSafeApiErrorMessage(
            error,
            this.translation.translate('permissions.loadFailed')
          )
        );
        this.loading.set(false);
      }
    });
  }

  createPermission(): void {
    void this.router.navigate([
      '/app/admin/permissions/create'
    ]);
  }

  editPermission(permission: Permission): void {
    void this.router.navigate([
      '/app/admin/permissions',
      permission.id,
      'edit'
    ]);
  }

  deletePermission(permission: Permission): void {
    if (this.deletingId()) {
      return;
    }

    if (permission.roleCount > 0) {
      this.toast.error(
        this.translation.translate('permissions.deleteAssignedError')
      );
      return;
    }

    const confirmed = window.confirm(
      this.translation.translate(
        'permissions.deleteConfirm',
        { name: permission.name }
      )
    );

    if (!confirmed) {
      return;
    }

    this.deletingId.set(permission.id);

    this.api.delete(permission.id).subscribe({
      next: () => {
        this.deletingId.set(null);
        this.toast.success(
          this.translation.translate('permissions.deleteSuccess')
        );

        if (
          this.permissions().length === 1
          && this.pageNumber() > 1
        ) {
          this.pageNumber.update(current => current - 1);
        }

        this.loadPage();
      },

      error: error => {
        this.deletingId.set(null);
        this.toast.error(
          getSafeApiErrorMessage(
            error,
            this.translation.translate('permissions.deleteFailed')
          )
        );
      }
    });
  }

  refresh(): void {
    if (this.loading()) {
      return;
    }

    this.loadPage();
  }

  setSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.search.set(input.value);
    this.searchChanges.next(input.value.trim());
  }

  clearSearch(): void {
    this.search.set('');
    this.searchChanges.next('');
  }

  previousPage(): void {
    if (this.loading() || !this.hasPreviousPage()) {
      return;
    }

    this.pageNumber.update(current => current - 1);
    this.loadPage();
  }

  nextPage(): void {
    if (this.loading() || !this.hasNextPage()) {
      return;
    }

    this.pageNumber.update(current => current + 1);
    this.loadPage();
  }

  changePageSize(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const value = Number(select.value);

    if (!Number.isFinite(value) || value < 1 || value > 100) {
      return;
    }

    this.pageSize.set(value);
    this.pageNumber.set(1);
    this.loadPage();
  }
}
