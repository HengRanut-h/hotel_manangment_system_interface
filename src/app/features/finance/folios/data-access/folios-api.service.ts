import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  AddFolioChargeRequest,
  CreateFolioRequest,
  Folio
} from '../models/folio.model';

interface ApiEnvelope<T> {
  success?: boolean;
  status?: number;
  code?: string;
  message?: string;
  data: T;
}

type FolioResponse =
  | Folio
  | ApiEnvelope<Folio>;

@Injectable({
  providedIn: 'root'
})
export class FoliosApiService {
  private readonly http =
    inject(HttpClient);

  private readonly baseUrl =
    '/api/v1/folios';

  getById(
    id: string
  ): Observable<Folio> {
    return this.http
      .get<FolioResponse>(
        `${this.baseUrl}/${id}`
      )
      .pipe(
        map(
          response =>
            this.unwrap(response)
        )
      );
  }

  create(
    request: CreateFolioRequest
  ): Observable<Folio> {
    return this.http
      .post<FolioResponse>(
        this.baseUrl,
        request
      )
      .pipe(
        map(
          response =>
            this.unwrap(response)
        )
      );
  }

  addCharge(
    id: string,
    request: AddFolioChargeRequest
  ): Observable<unknown> {
    return this.http.post(
      `${this.baseUrl}/${id}/charges`,
      request
    );
  }

  close(
    id: string
  ): Observable<unknown> {
    return this.http.post(
      `${this.baseUrl}/${id}/close`,
      {}
    );
  }

  private unwrap<T>(
    response: T | ApiEnvelope<T>
  ): T {
    if (
      response &&
      typeof response === 'object' &&
      'data' in response
    ) {
      return (response as ApiEnvelope<T>).data;
    }

    return response as T;
  }
}
