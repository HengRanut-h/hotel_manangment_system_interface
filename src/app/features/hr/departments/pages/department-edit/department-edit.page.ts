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
  DepartmentFormComponent,
  DepartmentFormValue
} from '../../components/department-form/department-form.component';

import {
  DepartmentApiService
} from '../../data-access/department-api.service';

import {
  Department
} from '../../models/department.model';

@Component({
  selector: 'app-department-edit.page',
  standalone: true,
  imports: [
    RouterLink,
    TranslationPipe,
    SpinComponent,
    DepartmentFormComponent,
    LucideArrowLeft
  ],
  templateUrl: './department-edit.page.html',
  styleUrl: './department-edit.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartmentEditPage
  implements OnInit {

  private readonly api =
    inject(
      DepartmentApiService
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

  readonly department =
    signal<Department | null>(
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
          'departments.missingId'
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

    this.api
      .getById(
        id
      )
      .subscribe({
        next:
          department => {

            this.department.set(
              department
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
                  'departments.loadOneFailed'
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
    value: DepartmentFormValue
  ): void {

    const department =
      this.department();

    if (
      !department
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
        department.id,
        {
          name:
            value.name,
          code:
            value.code,
          description:
            value.description,
          isActive:
            value.isActive
        }
      )
      .subscribe({
        next:
          updated => {

            this.toast.success(
              this.translation.translate(
                'departments.updateSuccess'
              )
            );

            void this.router.navigate([
              '/app/hr/departments',
              updated.id
            ]);
          },
        error:
          error => {

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'departments.updateFailed'
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

    const department =
      this.department();

    void this.router.navigate(
      department
        ? [
          '/app/hr/departments',
          department.id
        ]
        : [
          '/app/hr/departments'
        ]
    );
  }

}
