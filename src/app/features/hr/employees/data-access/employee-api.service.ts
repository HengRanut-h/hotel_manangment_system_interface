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
  CreateEmployeeRequest,
  Employee,
  UpdateEmployeeRequest
} from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeApiService {

  private readonly api =
    inject(
      ApiClientService
    );

  getAll(): Observable<Employee[]> {

    return this.api
      .get<Employee[]>(
        'employees'
      );
  }

  getById(
    id: string
  ): Observable<Employee> {

    return this.api
      .get<Employee>(
        `employees/${id}`
      );
  }

  create(
    request: CreateEmployeeRequest
  ): Observable<Employee> {

    return this.api
      .post<Employee>(
        'employees',
        {
          employeeNumber:
            request.employeeNumber,
          fullName:
            request.fullName,
          email:
            request.email || null,
          departmentId:
            request.departmentId || null,
          positionId:
            request.positionId || null,
          branchId:
            request.branchId || null
        }
      );
  }

  update(
    id: string,
    request: UpdateEmployeeRequest
  ): Observable<Employee> {

    return this.api
      .put<Employee>(
        `employees/${id}`,
        {
          employeeNumber:
            request.employeeNumber,
          fullName:
            request.fullName,
          email:
            request.email || null,
          departmentId:
            request.departmentId || null,
          positionId:
            request.positionId || null,
          branchId:
            request.branchId || null
        }
      );
  }

  delete(
    id: string
  ): Observable<void> {

    return this.api
      .delete<void>(
        `employees/${id}`
      );
  }

}
