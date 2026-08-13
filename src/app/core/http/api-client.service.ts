import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { unwrapApiResponse } from './api-response.models';

export type ApiQueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

@Injectable({ providedIn: 'root' })
export class ApiClientService {
  private readonly http = inject(HttpClient);

  // =========================================================
  // GET
  // =========================================================

  get<T>(path: string, params?: ApiQueryParams) {
    return this.http
      .get<unknown>(this.url(path), {
        params: this.buildParams(params)
      })
      .pipe(map(response => unwrapApiResponse<T>(response)));
  }

  // =========================================================
  // POST
  // =========================================================

  post<T>(path: string, body: unknown = {}) {
    return this.http
      .post<unknown>(this.url(path), body)
      .pipe(map(response => unwrapApiResponse<T>(response)));
  }

  // =========================================================
  // PUT
  // =========================================================

  put<T>(path: string, body: unknown) {
    return this.http
      .put<unknown>(this.url(path), body)
      .pipe(map(response => unwrapApiResponse<T>(response)));
  }

  // =========================================================
  // PATCH
  // =========================================================

  patch<T>(path: string, body: unknown = {}) {
    return this.http
      .patch<unknown>(this.url(path), body)
      .pipe(map(response => unwrapApiResponse<T>(response)));
  }

  // =========================================================
  // DELETE
  // =========================================================

  delete<T>(path: string) {
    return this.http
      .delete<unknown>(this.url(path))
      .pipe(map(response => unwrapApiResponse<T>(response)));
  }

  // =========================================================
  // DOWNLOAD FILE
  // =========================================================

  getBlob(path: string, params?: ApiQueryParams) {
    return this.http.get(this.url(path), {
      params: this.buildParams(params),
      responseType: 'blob'
    });
  }

  // =========================================================
  // BUILD URL
  // =========================================================

  private url(path: string): string {
    const cleanPath = path.replace(/^\/+/, '');
    return `${environment.apiBaseUrl}/${cleanPath}`;
  }

  // =========================================================
  // BUILD QUERY PARAMS
  // =========================================================

  private buildParams(params?: ApiQueryParams): HttpParams {
    let httpParams = new HttpParams();

    for (const [key, value] of Object.entries(params ?? {})) {
      if (value === null || value === undefined || value === '') {
        continue;
      }

      httpParams = httpParams.set(key, String(value));
    }

    return httpParams;
  }
}
