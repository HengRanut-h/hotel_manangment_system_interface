import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiClientService } from '../../core/http/api-client.service';
import { normalizePaged, PagedResult } from '../models/paged-result.model';
import { ResourceConfig, ResourceRow } from './resource.models';

@Injectable({ providedIn: 'root' })
export class ResourceApiService {
  private readonly api = inject(ApiClientService);

  // =========================================================
  // GET ALL
  // =========================================================

  list(
    config: ResourceConfig,
    pageNumber: number,
    pageSize: number,
    search: string,
    status: string,
    isActive: string,
    sortBy: string,
    sortDirection: 'asc' | 'desc'
  ) {
    return this.api
      .get<PagedResult<ResourceRow> | ResourceRow[]>(config.endpoint, {
        pageNumber,
        pageSize,
        search,
        status:
          config.kind === 'operational' && status
            ? status
            : undefined,
        isActive:
          config.kind === 'catalog' && isActive !== ''
            ? isActive === 'true'
            : undefined,
        sortBy,
        sortDirection
      })
      .pipe(map(normalizePaged));
  }

  // =========================================================
  // GET BY ID
  // =========================================================

  getById(config: ResourceConfig, id: string) {
    return this.api.get<ResourceRow>(`${config.endpoint}/${id}`);
  }

  // =========================================================
  // CREATE
  // =========================================================

  create(config: ResourceConfig, body: ResourceRow) {
    return this.api.post<ResourceRow>(config.endpoint, body);
  }

  // =========================================================
  // UPDATE
  // =========================================================

  update(config: ResourceConfig, id: string, body: ResourceRow) {
    return this.api.put<ResourceRow>(`${config.endpoint}/${id}`, body);
  }

  // =========================================================
  // CHANGE STATUS
  // =========================================================

  status(config: ResourceConfig, id: string, status: string) {
    return this.api.patch<unknown>(
      `${config.endpoint}/${id}/status`,
      { status }
    );
  }

  // =========================================================
  // ACTIVE / INACTIVE
  // =========================================================

  active(config: ResourceConfig, id: string, isActive: boolean) {
    return this.api.patch<ResourceRow>(
      `${config.endpoint}/${id}/active`,
      { isActive }
    );
  }

  // =========================================================
  // DELETE
  // =========================================================

  delete(config: ResourceConfig, id: string) {
    return this.api.delete<void>(`${config.endpoint}/${id}`);
  }

  // =========================================================
  // RESTORE
  // =========================================================

  restore(config: ResourceConfig, id: string) {
    return this.api.post<ResourceRow>(
      `${config.endpoint}/${id}/restore`,
      {}
    );
  }
}
