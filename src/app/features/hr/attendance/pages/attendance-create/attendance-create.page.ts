import {
  ChangeDetectionStrategy,
  Component,
  inject,
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
  AttendanceFormComponent,
  AttendanceFormValue
} from '../../components/attendance-form/attendance-form.component';

import {
  AttendanceApiService
} from '../../data-access/attendance-api.service';

@Component({
  selector: 'app-attendance-create.page',
  standalone: true,
  imports: [
    RouterLink,
    TranslationPipe,
    AttendanceFormComponent,
    LucideArrowLeft
  ],
  templateUrl: './attendance-create.page.html',
  styleUrl: './attendance-create.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttendanceCreatePage {

  private readonly api =
    inject(
      AttendanceApiService
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

  save(
    value: AttendanceFormValue
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
        title:
          value.title,
        notes:
          value.notes,
        amount:
          value.amount,
        eventAtUtc:
          value.eventAtUtc,
        branchId:
          value.branchId,
        relatedEntityId:
          value.relatedEntityId,
        relatedEntityType:
          value.relatedEntityType,
        status:
          value.status
      })
      .subscribe({
        next:
          record => {

            this.toast.success(
              this.translation.translate(
                'attendance.createSuccess'
              )
            );

            void this.router.navigate([
              '/app/hr/attendance',
              record.id
            ]);
          },
        error:
          error => {

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'attendance.createFailed'
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
      '/app/hr/attendance'
    ]);
  }

}
