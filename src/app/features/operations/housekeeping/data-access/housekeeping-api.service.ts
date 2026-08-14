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
  CreateHousekeepingTaskRequest,
  HousekeepingTask
} from '../models/housekeeping.model';

@Injectable({
  providedIn: 'root'
})
export class HousekeepingApiService {

  private readonly api =
    inject(
      ApiClientService
    );

  getAll(): Observable<HousekeepingTask[]> {

    return this.api
      .get<HousekeepingTask[]>(
        'housekeeping'
      );
  }

  getById(
    id: string
  ): Observable<HousekeepingTask> {

    return this.api
      .get<HousekeepingTask>(
        `housekeeping/${id}`
      );
  }

  create(
    request: CreateHousekeepingTaskRequest
  ): Observable<string> {

    return this.api
      .post<string>(
        'housekeeping',
        {
          roomId:
            request.roomId,
          taskType:
            request.taskType,
          priority:
            request.priority
        }
      );
  }

  complete(
    id: string
  ): Observable<unknown> {

    return this.api
      .post<unknown>(
        `housekeeping/${id}/complete`,
        {}
      );
  }

}
