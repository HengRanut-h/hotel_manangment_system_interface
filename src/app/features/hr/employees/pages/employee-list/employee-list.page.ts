import {
  DatePipe
} from '@angular/common';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  RouterLink
} from '@angular/router';

import {
  LucideChevronLeft,
  LucideChevronRight,
  LucideCircleCheck,
  LucideCircleX,
  LucideEye,
  LucideFilter,
  LucidePencil,
  LucidePlus,
  LucideRotateCcw,
  LucideSearch,
  LucideTrash2,
  LucideUsers
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
  ToastService
} from '../../../../../shared/ui/toast/toast.service';

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

type EmployeeStatusFilter =
  | 'all'
  | 'active'
  | 'inactive';

type EmployeeSortField =
  | 'fullName'
  | 'employeeNumber'
  | 'createdAt';

type SortDirection =
  | 'asc'
  | 'desc';

@Component({
  selector: 'app-employee-list.page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    DatePipe,
    TranslationPipe,
    SpinComponent,
    LucideChevronLeft,
    LucideChevronRight,
    LucideCircleCheck,
    LucideCircleX,
    LucideEye,
    LucideFilter,
    LucidePencil,
    LucidePlus,
    LucideRotateCcw,
    LucideSearch,
    LucideTrash2,
    LucideUsers
  ],
  templateUrl: './employee-list.page.html',
  styleUrl: './employee-list.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeListPage
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

  private readonly toast =
    inject(
      ToastService
    );

  private readonly translation =
    inject(
      TranslationService
    );

  readonly employees =
    signal<Employee[]>(
      []
    );

  readonly departments =
    signal<EmployeeLookupOption[]>(
      []
    );

  readonly positions =
    signal<EmployeeLookupOption[]>(
      []
    );

  readonly loading =
    signal(
      true
    );

  readonly error =
    signal(
      ''
    );

  readonly mutatingId =
    signal<string | null>(
      null
    );

  readonly search =
    signal(
      ''
    );

  readonly status =
    signal<EmployeeStatusFilter>(
      'all'
    );

  readonly sortBy =
    signal<EmployeeSortField>(
      'fullName'
    );

  readonly sortDirection =
    signal<SortDirection>(
      'asc'
    );

  readonly pageNumber =
    signal(
      1
    );

  readonly pageSize =
    signal(
      20
    );

  readonly totalCount =
    computed(
      () =>
        this.filteredEmployees()
          .length
    );

  readonly totalPages =
    computed(
      () =>
        Math.max(
          1,
          Math.ceil(
            this.totalCount() /
            this.pageSize()
          )
        )
    );

  readonly hasPreviousPage =
    computed(
      () =>
        this.pageNumber() > 1
    );

  readonly hasNextPage =
    computed(
      () =>
        this.pageNumber() < this.totalPages()
    );

  readonly departmentNameById =
    computed(
      () =>
        new Map(
          this.departments()
            .map(
              department => [
                department.id,
                department.name
              ]
            )
        )
    );

  readonly positionNameById =
    computed(
      () =>
        new Map(
          this.positions()
            .map(
              position => [
                position.id,
                position.name
              ]
            )
        )
    );

  readonly filteredEmployees =
    computed(
      () => {

        const term =
          this.search()
            .trim()
            .toLowerCase();

        const status =
          this.status();

        const filtered =
          this.employees()
            .filter(
              employee => {

                const statusMatches =
                  status === 'all'
                  ||
                  (
                    status === 'active'
                    &&
                    employee.isActive
                  )
                  ||
                  (
                    status === 'inactive'
                    &&
                    !employee.isActive
                  );

                if (!statusMatches) {
                  return false;
                }

                if (!term) {
                  return true;
                }

                return [
                  employee.employeeNumber,
                  employee.fullName,
                  employee.email ?? ''
                ]
                  .some(
                    value =>
                      value
                        .toLowerCase()
                        .includes(
                          term
                        )
                  );
              }
            );

        const direction =
          this.sortDirection() === 'desc'
            ? -1
            : 1;

        return [
          ...filtered
        ]
          .sort(
            (first, second) => {

              const firstValue =
                this.getSortValue(
                  first
                );

              const secondValue =
                this.getSortValue(
                  second
                );

              return firstValue.localeCompare(
                secondValue
              ) * direction;
            }
          );
      }
    );

  readonly pagedEmployees =
    computed(
      () => {

        const start =
          (
            this.pageNumber() - 1
          ) *
          this.pageSize();

        return this.filteredEmployees()
          .slice(
            start,
            start + this.pageSize()
          );
      }
    );

  readonly activeOnPage =
    computed(
      () =>
        this.pagedEmployees()
          .filter(
            employee =>
              employee.isActive
          )
          .length
    );

  readonly inactiveOnPage =
    computed(
      () =>
        this.pagedEmployees()
          .filter(
            employee =>
              !employee.isActive
          )
          .length
    );

  ngOnInit(): void {

    this.load();
  }

  load(): void {

    this.loading.set(
      true
    );

    this.error.set(
      ''
    );

    forkJoin({
      employees:
        this.api.getAll(),
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

            this.employees.set(
              result.employees
            );

            this.departments.set(
              result.departments.items
            );

            this.positions.set(
              result.positions.items
            );

            this.pageNumber.set(
              1
            );

            this.loading.set(
              false
            );
          },
        error:
          error => {

            this.employees.set(
              []
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
                  'employees.loadFailed'
                )
              )
            );

            this.loading.set(
              false
            );
          }
      });
  }

  applyFilters(): void {

    this.pageNumber.set(
      1
    );
  }

  clearFilters(): void {

    this.search.set(
      ''
    );

    this.status.set(
      'all'
    );

    this.sortBy.set(
      'fullName'
    );

    this.sortDirection.set(
      'asc'
    );

    this.pageNumber.set(
      1
    );
  }

  previousPage(): void {

    if (
      this.loading()
      ||
      !this.hasPreviousPage()
    ) {
      return;
    }

    this.pageNumber.update(
      value =>
        value - 1
    );
  }

  nextPage(): void {

    if (
      this.loading()
      ||
      !this.hasNextPage()
    ) {
      return;
    }

    this.pageNumber.update(
      value =>
        value + 1
    );
  }

  departmentLabel(
    employee: Employee
  ): string {

    return this.lookupLabel(
      employee.departmentId,
      this.departmentNameById(),
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
      this.positionNameById(),
      this.translation.translate(
        'employees.unassigned'
      )
    );
  }

  deleteEmployee(
    employee: Employee
  ): void {

    if (
      this.mutatingId()
    ) {
      return;
    }

    const message =
      this.translation.translate(
        'employees.deleteConfirm',
        {
          name:
            employee.fullName
        }
      );

    if (
      !window.confirm(
        message
      )
    ) {
      return;
    }

    this.mutatingId.set(
      employee.id
    );

    this.api
      .delete(
        employee.id
      )
      .subscribe({
        next:
          () => {

            this.toast.success(
              this.translation.translate(
                'employees.deleteSuccess'
              )
            );

            this.mutatingId.set(
              null
            );

            this.load();
          },
        error:
          error => {

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'employees.deleteFailed'
                )
              )
            );

            this.mutatingId.set(
              null
            );
          }
      });
  }

  private getSortValue(
    employee: Employee
  ): string {

    switch (
      this.sortBy()
    ) {
      case 'employeeNumber':
        return employee.employeeNumber;

      case 'createdAt':
        return employee.createdAtUtc;

      default:
        return employee.fullName;
    }
  }

  private lookupLabel(
    id: string | null,
    names: Map<string, string>,
    fallback: string
  ): string {

    if (!id) {
      return fallback;
    }

    return names.get(
      id
    )
    ?? id;
  }

}
