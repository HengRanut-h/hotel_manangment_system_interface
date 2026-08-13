import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  LucideCheck,
  LucideRefreshCw,
  LucideSave,
  LucideSearch,
  LucideShield,
  LucideShieldCheck,
  LucideX
} from '@lucide/angular';

import {
  forkJoin
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
  PermissionApiService
} from '../../../permissions/data-access/permission-api.service';

import {
  Permission
} from '../../../permissions/models/permission.model';

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
  RoleApiService
} from '../../data-access/role-api.service';

import {
  Role
} from '../../models/role.model';

interface PermissionGroup {
  name: string;
  items: Permission[];
}

@Component({
  selector: 'app-role-permissions-page',
  standalone: true,
  imports: [
    TranslationPipe,
    PageHeaderComponent,
    SpinComponent,
    LucideCheck,
    LucideRefreshCw,
    LucideSave,
    LucideSearch,
    LucideShield,
    LucideShieldCheck,
    LucideX
  ],
  templateUrl: './role-permissions.page.html',
  styleUrl: './role-permissions.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RolePermissionsPage implements OnInit {
  private readonly roleApi = inject(RoleApiService);
  private readonly permissionApi = inject(PermissionApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly translation = inject(TranslationService);

  readonly role = signal<Role | null>(null);
  readonly permissions = signal<Permission[]>([]);
  readonly selected = signal<string[]>([]);
  readonly search = signal('');
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly errorMessage = signal('');

  readonly selectedCount = computed(() => this.selected().length);
  readonly totalPermissions = computed(() => this.permissions().length);

  readonly backUrl = computed(() => {
    const currentRole = this.role();
    return currentRole
      ? `/app/admin/roles/${currentRole.id}`
      : '/app/admin/roles';
  });

  readonly groups = computed<PermissionGroup[]>(() => {
    const searchTerm = this.search().trim().toLowerCase();
    const groupMap = new Map<string, Permission[]>();

    const filteredPermissions = this.permissions().filter(permission => {
      if (!searchTerm) {
        return true;
      }

      return permission.name.toLowerCase().includes(searchTerm);
    });

    for (const permission of filteredPermissions) {
      const groupName = permission.name.split('.')[0].trim() || 'other';
      const current = groupMap.get(groupName) ?? [];
      current.push(permission);
      groupMap.set(groupName, current);
    }

    return Array.from(groupMap.entries())
      .map(([name, items]) => ({
        name,
        items: [...items].sort((a, b) => a.name.localeCompare(b.name))
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage.set(
        this.translation.translate('roles.missingId')
      );
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    forkJoin({
      role: this.roleApi.getById(id),
      permissions: this.permissionApi.getAll()
    }).subscribe({
      next: response => {
        this.role.set(response.role);
        this.permissions.set(response.permissions);
        this.selected.set(
          Array.isArray(response.role.permissions)
            ? [...response.role.permissions]
            : []
        );
        this.loading.set(false);
      },

      error: error => {
        this.errorMessage.set(
          getSafeApiErrorMessage(
            error,
            this.translation.translate('roles.permissionsLoadFailed')
          )
        );
        this.loading.set(false);
      }
    });
  }

  isSelected(permissionName: string): boolean {
    return this.selected().includes(permissionName);
  }

  toggle(permissionName: string): void {
    this.selected.update(current =>
      current.includes(permissionName)
        ? current.filter(item => item !== permissionName)
        : [...current, permissionName]
    );
  }

  isGroupSelected(group: PermissionGroup): boolean {
    return group.items.length > 0
      && group.items.every(permission => this.isSelected(permission.name));
  }

  selectGroup(group: PermissionGroup): void {
    const names = group.items.map(permission => permission.name);

    if (this.isGroupSelected(group)) {
      this.selected.update(current =>
        current.filter(name => !names.includes(name))
      );
      return;
    }

    this.selected.update(current =>
      Array.from(new Set([...current, ...names]))
    );
  }

  selectAll(): void {
    this.selected.set(
      this.permissions().map(permission => permission.name)
    );
  }

  clearAll(): void {
    this.selected.set([]);
  }

  setSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.search.set(input.value);
  }

  clearSearch(): void {
    this.search.set('');
  }

  save(): void {
    const currentRole = this.role();

    if (!currentRole || this.saving()) {
      return;
    }

    this.saving.set(true);

    this.roleApi.setPermissions(
      currentRole.id,
      { permissions: this.selected() }
    ).subscribe({
      next: () => {
        this.toast.success(
          this.translation.translate('roles.permissionsSaveSuccess')
        );
        void this.router.navigate([
          '/app/admin/roles',
          currentRole.id
        ]);
      },

      error: error => {
        this.saving.set(false);
        this.toast.error(
          getSafeApiErrorMessage(
            error,
            this.translation.translate('roles.permissionsSaveFailed')
          )
        );
      }
    });
  }

  cancel(): void {
    void this.router.navigateByUrl(this.backUrl());
  }
}
