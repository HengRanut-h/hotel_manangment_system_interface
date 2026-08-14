import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import {
  LucideArrowLeft
} from '@lucide/angular';

import {
  forkJoin
} from 'rxjs';

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
  ToastService
} from '../../../../../shared/ui/toast/toast.service';

import {
  DepartmentApiService
} from '../../../departments/data-access/department-api.service';

import {
  PositionApiService
} from '../../../positions/data-access/position-api.service';

import {
  EmployeeFormComponent,
  EmployeeFormValue
} from '../../components/employee-form/employee-form.component';

import {
  EmployeeApiService
} from '../../data-access/employee-api.service';

import {
  Employee
} from '../../models/employee.model';

import {
  EmployeeLookupOption
} from '../../models/employee.model';

@Component({
  selector: 'app-employee-edit.page',
  standalone: true,
  imports: [
    RouterLink,
    TranslationPipe,
    SpinComponent,
    EmployeeFormComponent,
    LucideArrowLeft
  ],
  templateUrl: './employee-edit.page.html',
  styleUrl: './employee-edit.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeEditPage
  implements OnInit {

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

  private readonly router =
    inject(
      Router
    );

  private readonly toast =
    inject(
      ToastService
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

  readonly saving =
    signal(
      false
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

            this.error.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'employees.loadOneFailed'
                )
              )
            );

            this.departments.set(
              []
            );

            this.positions.set(
              []
            );

            this.loading.set(
              false
            );
          }
      });
  }

  save(
    value: EmployeeFormValue
  ): void {

    const employee =
      this.employee();

    if (
      !employee
      ||
      this.saving()
    ) {
      return;
    }

    this.saving.set(
      true
    );

    this.api
      .update(
        employee.id,
        {
          employeeNumber:
            employee.employeeNumber,
          fullName:
            value.fullName,
          email:
            value.email,
          departmentId:
            value.departmentId,
          positionId:
            value.positionId,
          branchId:
            employee.branchId
        }
      )
      .subscribe({
        next:
          updated => {

            this.toast.success(
              this.translation.translate(
                'employees.updateSuccess'
              )
            );

            void this.router.navigate([
              '/app/hr/employees',
              updated.id
            ]);
          },
        error:
          error => {

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'employees.updateFailed'
                )
              )
            );

            this.saving.set(
              false
            );
          }
      });
  }

  cancel(): void {

    const employee =
      this.employee();

    void this.router.navigate(
      employee
        ? [
          '/app/hr/employees',
          employee.id
        ]
        : [
          '/app/hr/employees'
        ]
    );
  }

}
