import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';

import { ApiClientService } from '../../../../core/http/api-client.service';
import {
  CreatePermissionRequest,
  Permission,
  PermissionPagedResult,
  PermissionQuery,
  UpdatePermissionRequest
} from '../models/permission.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionApiService {
  private readonly api = inject(ApiClientService);

  getPage(request: PermissionQuery = {}): Observable<PermissionPagedResult> {
    const params: Record<string, string | number> = {
      sortBy: request.sortBy ?? 'name',
      sortDirection: request.sortDirection ?? 'asc',
      pageNumber: request.pageNumber ?? 1,
      pageSize: request.pageSize ?? 20
    };

    if (request.search?.trim()) params['search'] = request.search.trim();
    if (request.name?.trim()) params['name'] = request.name.trim();
    if (request.createdBy?.trim()) params['createdBy'] = request.createdBy.trim();
    if (request.createdFrom?.trim()) params['createdFrom'] = request.createdFrom.trim();
    if (request.createdTo?.trim()) params['createdTo'] = request.createdTo.trim();

    return this.api.get<PermissionPagedResult>('permissions', params);
  }

  /**
   * Role-permissions needs the complete catalog.
   * Backend limits pageSize to 100, so load every page.
   */
  getAll(): Observable<Permission[]> {
    const pageSize = 100;
    const baseQuery = {
      pageSize,
      sortBy: 'name' as const,
      sortDirection: 'asc' as const
    };

    return this.getPage({ ...baseQuery, pageNumber: 1 }).pipe(
      switchMap(firstPage => {
        const firstItems = Array.isArray(firstPage.items) ? firstPage.items : [];
        const totalPages = Math.max(1, Number(firstPage.totalPages ?? 1));

        if (totalPages === 1) {
          return of(firstItems);
        }

        const requests = Array.from(
          { length: totalPages - 1 },
          (_, index) => this.getPage({
            ...baseQuery,
            pageNumber: index + 2
          })
        );

        return forkJoin(requests).pipe(
          map(pages => [
            ...firstItems,
            ...pages.flatMap(page => Array.isArray(page.items) ? page.items : [])
          ])
        );
      })
    );
  }

  getById(id: string): Observable<Permission> {
    return this.api.get<Permission>(`permissions/${id}`);
  }

  create(request: CreatePermissionRequest): Observable<Permission> {
    return this.api.post<Permission>('permissions', request);
  }

  update(id: string, request: UpdatePermissionRequest): Observable<Permission> {
    return this.api.put<Permission>(`permissions/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`permissions/${id}`);
  }
}
