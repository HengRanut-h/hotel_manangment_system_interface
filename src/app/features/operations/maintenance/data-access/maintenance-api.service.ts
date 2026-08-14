import {
  inject,
  Injectable
} from '@angular/core';

import {
  Observable
} from 'rxjs';

import {
  ApiClientService
} from '../../../../core/http/api-client.service';

import {
  CreateMaintenanceRequest,
  MaintenanceRequest
} from '../models/maintenance.model';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceApiService {

  private readonly api =
    inject(
      ApiClientService
    );

  getAll(): Observable<MaintenanceRequest[]> {

    return this.api
      .get<MaintenanceRequest[]>(
        'maintenance'
      );
  }

  getById(
    id: string
  ): Observable<MaintenanceRequest> {

    return this.api
      .get<MaintenanceRequest>(
        `maintenance/${id}`
      );
  }

  create(
    request: CreateMaintenanceRequest
  ): Observable<string> {

    return this.api
      .post<string>(
        'maintenance',
        request
      );
  }

  complete(
    id: string
  ): Observable<unknown> {

    return this.api
      .post<unknown>(
        `maintenance/${id}/complete`,
        {}
      );
  }

}
