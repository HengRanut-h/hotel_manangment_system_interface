import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  LucideCirclePlus,
  LucidePencil,
  LucideSearch,
  LucideTrash2
} from '@lucide/angular';
import { ApiClientService } from '../../../../core/http/api-client.service';
import {
  normalizePaged,
  PagedResult
} from '../../../../shared/models/paged-result.model';
import { ModalComponent } from '../../../../shared/ui/modal/modal.component';
import { PagerComponent } from '../../../../shared/ui/pager/pager.component';
import { StatusBadgeComponent } from '../../../../shared/ui/status-badge/status-badge.component';
import { ToastService } from '../../../../shared/ui/toast/toast.service';

interface RoomTypeRow {
  id: string;
  name: string;
  code: string;
  baseRate: number;
  maxAdults: number;
  maxChildren: number;
  description?: string;
  isActive: boolean;
}

@Component({
  selector: 'app-room-types-page',
  standalone: true,
  imports: [
    CurrencyPipe,
    FormsModule,
    LucideCirclePlus,
    LucidePencil,
    LucideSearch,
    LucideTrash2,
    ModalComponent,
    PagerComponent,
    StatusBadgeComponent
  ],
  templateUrl: './room-types.page.html',
  styleUrl: '../rooms/rooms.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomTypesPage implements OnInit {
  private readonly api = inject(ApiClientService);
  private readonly toast = inject(ToastService);

  readonly rows = signal<RoomTypeRow[]>([]);
  readonly page = signal(1);
  readonly total = signal(0);
  readonly search = signal('');
  readonly modal = signal(false);
  readonly editId = signal<string | null>(null);
  readonly busyId = signal<string | null>(null);

  name = '';
  code = '';
  baseRate = 0;
  maxAdults = 2;
  maxChildren = 1;
  description = '';
  isActive = true;

  // =========================================================
  // INITIALIZE
  // =========================================================

  ngOnInit(): void {
    this.load();
  }

  // =========================================================
  // GET ALL
  // GET /api/v1/room-types
  // =========================================================

  load(): void {
    this.api
      .get<PagedResult<RoomTypeRow> | RoomTypeRow[]>('room-types', {
        pageNumber: this.page(),
        pageSize: 20,
        search: this.search()
      })
      .subscribe(response => {
        const paged = normalizePaged(response);
        this.rows.set(paged.items);
        this.total.set(paged.totalItems);
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
  // PAGINATION
  // =========================================================

  changePage(pageNumber: number): void {
    this.page.set(pageNumber);
    this.load();
  }

  // =========================================================
  // CREATE FORM
  // =========================================================

  create(): void {
    this.editId.set(null);
    this.name = '';
    this.code = '';
    this.baseRate = 0;
    this.maxAdults = 2;
    this.maxChildren = 1;
    this.description = '';
    this.isActive = true;
    this.modal.set(true);
  }

  // =========================================================
  // EDIT FORM
  // =========================================================

  edit(roomType: RoomTypeRow): void {
    this.editId.set(roomType.id);
    this.name = roomType.name;
    this.code = roomType.code;
    this.baseRate = roomType.baseRate;
    this.maxAdults = roomType.maxAdults;
    this.maxChildren = roomType.maxChildren;
    this.description = roomType.description ?? '';
    this.isActive = roomType.isActive;
    this.modal.set(true);
  }

  // =========================================================
  // CREATE / UPDATE
  // POST /api/v1/room-types
  // PUT  /api/v1/room-types/{id}
  // =========================================================

  save(): void {
    const body = {
      name: this.name.trim(),
      code: this.code.trim(),
      baseRate: this.baseRate,
      maxAdults: this.maxAdults,
      maxChildren: this.maxChildren,
      description: this.description.trim() || null,
      isActive: this.isActive
    };

    const id = this.editId();

    const request = id
      ? this.api.put<RoomTypeRow>(`room-types/${id}`, body)
      : this.api.post<RoomTypeRow>('room-types', body);

    request.subscribe(() => {
      this.toast.success(
        `Room type ${id ? 'updated' : 'created'} successfully`
      );

      this.modal.set(false);
      this.load();
    });
  }

  // =========================================================
  // ACTIVE / INACTIVE
  // PATCH /api/v1/room-types/{id}/active
  // =========================================================

  toggleActive(roomType: RoomTypeRow): void {
    const isActive = !roomType.isActive;

    this.busyId.set(roomType.id);

    this.api
      .patch<RoomTypeRow>(`room-types/${roomType.id}/active`, {
        isActive
      })
      .subscribe({
        next: () => {
          this.toast.success(
            `Room type ${isActive ? 'activated' : 'deactivated'} successfully`
          );
          this.busyId.set(null);
          this.load();
        },
        error: () => {
          this.busyId.set(null);
        }
      });
  }

  // =========================================================
  // DELETE
  // DELETE /api/v1/room-types/{id}
  // =========================================================

  remove(roomType: RoomTypeRow): void {
    if (!confirm(`Delete ${roomType.name}?`)) {
      return;
    }

    this.busyId.set(roomType.id);

    this.api.delete<void>(`room-types/${roomType.id}`).subscribe({
      next: () => {
        this.toast.success('Room type deleted successfully');
        this.busyId.set(null);
        this.load();
      },
      error: () => {
        this.busyId.set(null);
      }
    });
  }
}
