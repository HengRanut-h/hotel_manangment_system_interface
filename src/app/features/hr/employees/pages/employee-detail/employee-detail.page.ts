import {
  DatePipe
} from '@angular/common';

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import {
  LucideArrowLeft,
  LucidePencil
} from '@lucide/angular';

import {
  forkJoin
} from 'rxjs';

import {
  AuthStore
} from '../../../../../core/auth/auth.store';

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
  SpinComponent
} from '../../../../../shared/ui/spin/spin.component';

import {
  DepartmentApiService
} from '../../../departments/data-access/department-api.service';

import {
  PositionApiService
} from '../../../positions/data-access/position-api.service';

import {
  EmployeeApiService
} from '../../data-access/employee-api.service';

import {
  Employee,
  EmployeeLookupOption
} from '../../models/employee.model';

@Component({
  selector: 'app-employee-detail.page',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe,
    TranslationPipe,
    SpinComponent,
    LucideArrowLeft,
    LucidePencil
  ],
  templateUrl: './employee-detail.page.html',
  styleUrl: './employee-detail.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeDetailPage
  implements OnInit {

  readonly auth =
    inject(
      AuthStore
    );

  private readonly api =
    inject(
      EmployeeApiService
    );

  private readonly departmentsApi =
    inject(
      DepartmentApiService
    );

  private readonly positionsApi =
    inject(
      PositionApiService
    );

  private readonly route =
    inject(
      ActivatedRoute
    );

  private readonly translation =
    inject(
      TranslationService
    );

  readonly employee =
    signal<Employee | null>(
      null
    );

  readonly loading =
    signal(
      true
    );

  readonly error =
    signal(
      ''
    );

  readonly departments =
    signal<EmployeeLookupOption[]>(
      []
    );

  readonly positions =
    signal<EmployeeLookupOption[]>(
      []
    );

  ngOnInit(): void {

    this.load();
  }

  load(): void {

    const id =
      this.route
        .snapshot
        .paramMap
        .get(
          'id'
        );

    if (!id) {
      this.error.set(
        this.translation.translate(
          'employees.missingId'
        )
      );
      this.loading.set(
        false
      );
      return;
    }

    this.loading.set(
      true
    );

    this.error.set(
      ''
    );

    forkJoin({
      employee:
        this.api.getById(
          id
        ),
      departments:
        this.departmentsApi.getPage({
          pageNumber:
            1,
          pageSize:
            100,
          isActive:
            true,
          sortBy:
            'name',
          sortDirection:
            'asc'
        }),
      positions:
        this.positionsApi.getPage({
          pageNumber:
            1,
          pageSize:
            100,
          isActive:
            true,
          sortBy:
            'name',
          sortDirection:
            'asc'
        })
    })
      .subscribe({
        next:
          result => {

            this.employee.set(
              result.employee
            );

            this.departments.set(
              result.departments.items
            );

            this.positions.set(
              result.positions.items
            );

            this.loading.set(
              false
            );
          },
        error:
          error => {

            this.employee.set(
              null
            );

            this.departments.set(
              []
            );

            this.positions.set(
              []
            );

            this.error.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'employees.loadOneFailed'
                )
              )
            );

            this.loading.set(
              false
            );
          }
      });
  }

  departmentLabel(
    employee: Employee
  ): string {

    return this.lookupLabel(
      employee.departmentId,
      this.departments(),
      this.translation.translate(
        'employees.unassigned'
      )
    );
  }

  positionLabel(
    employee: Employee
  ): string {

    return this.lookupLabel(
      employee.positionId,
      this.positions(),
      this.translation.translate(
        'employees.unassigned'
      )
    );
  }

  private lookupLabel(
    id: string | null,
    options: EmployeeLookupOption[],
    fallback: string
  ): string {

    if (!id) {
      return fallback;
    }

    const option =
      options.find(
        item =>
          item.id === id
      );

    return option
      ? `${option.name} (${option.code})`
      : id;
  }

}
