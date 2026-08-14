import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
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
  ToastService
} from '../../../../../shared/ui/toast/toast.service';

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
  EmployeeFormComponent,
  EmployeeFormValue
} from '../../components/employee-form/employee-form.component';

import {
  EmployeeApiService
} from '../../data-access/employee-api.service';

import {
  EmployeeLookupOption
} from '../../models/employee.model';

@Component({
  selector: 'app-employee-create.page',
  standalone: true,
  imports: [
    RouterLink,
    TranslationPipe,
    SpinComponent,
    EmployeeFormComponent,
    LucideArrowLeft
  ],
  templateUrl: './employee-create.page.html',
  styleUrl: './employee-create.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeCreatePage
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

  readonly saving =
    signal(
      false
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

    this.loadReferences();
  }

  loadReferences(): void {

    this.loading.set(
      true
    );

    this.error.set(
      ''
    );

    forkJoin({
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
                  'employees.loadReferencesFailed'
                )
              )
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

    if (
      this.saving()
    ) {
      return;
    }

    this.saving.set(
      true
    );

    this.api
      .create({
        employeeNumber:
          value.employeeNumber,
        fullName:
          value.fullName,
        email:
          value.email,
        departmentId:
          value.departmentId,
        positionId:
          value.positionId,
        branchId:
          value.branchId
      })
      .subscribe({
        next:
          employee => {

            this.toast.success(
              this.translation.translate(
                'employees.createSuccess'
              )
            );

            void this.router.navigate([
              '/app/hr/employees',
              employee.id
            ]);
          },
        error:
          error => {

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'employees.createFailed'
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

    void this.router.navigate([
      '/app/hr/employees'
    ]);
  }

}
