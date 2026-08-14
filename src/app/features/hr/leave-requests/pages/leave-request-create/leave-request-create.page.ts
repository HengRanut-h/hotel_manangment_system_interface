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
  LeaveRequestFormComponent,
  LeaveRequestFormValue
} from '../../components/leave-request-form/leave-request-form.component';

import {
  LeaveRequestApiService
} from '../../data-access/leave-request-api.service';

@Component({
  selector: 'app-leave-request-create.page',
  standalone: true,
  imports: [
    RouterLink,
    TranslationPipe,
    LeaveRequestFormComponent,
    LucideArrowLeft
  ],
  templateUrl: './leave-request-create.page.html',
  styleUrl: './leave-request-create.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaveRequestCreatePage {

  private readonly api =
    inject(
      LeaveRequestApiService
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
    value: LeaveRequestFormValue
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
                'leaveRequests.createSuccess'
              )
            );

            void this.router.navigate([
              '/app/hr/leave-requests',
              record.id
            ]);
          },
        error:
          error => {

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'leaveRequests.createFailed'
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
      '/app/hr/leave-requests'
    ]);
  }

}
