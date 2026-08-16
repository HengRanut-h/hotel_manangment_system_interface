import {
  HttpClient
} from '@angular/common/http';

import {
  Injectable,
  inject
} from '@angular/core';

import {
  Observable,
  map
} from 'rxjs';

import {
  CreateMeterReadingRequest,
  MeterReading
} from '../models/meter-reading.model';

interface ApiEnvelope<T> {
  success?: boolean;
  status?: number;
  code?: string;
  message?: string;
  data: T;
}

type MeterReadingsResponse =
  | MeterReading[]
  | ApiEnvelope<MeterReading[]>;

type CreateResponse =
  | MeterReading
  | ApiEnvelope<MeterReading>;

@Injectable({
  providedIn: 'root'
})
export class MeterReadingsApiService {

  private readonly http =
    inject(HttpClient);

  private readonly baseUrl =
    '/api/v1/meter-readings';

  getByMeterId(
    meterId: string
  ): Observable<MeterReading[]> {

    return this.http
      .get<MeterReadingsResponse>(
        `${this.baseUrl}/meter/${meterId}`
      )
      .pipe(
        map(
          response =>
            this.unwrap(
              response
            )
        )
      );
  }

  create(
    request:
      CreateMeterReadingRequest
  ): Observable<MeterReading> {

    return this.http
      .post<CreateResponse>(
        this.baseUrl,
        request
      )
      .pipe(
        map(
          response =>
            this.unwrap(
              response
            )
        )
      );
  }

  private unwrap<T>(
    response:
      T | ApiEnvelope<T>
  ): T {

    if (
      response &&
      typeof response === 'object' &&
      'data' in response
    ) {
      return (
        response as ApiEnvelope<T>
      ).data;
    }

    return response as T;
  }
}
