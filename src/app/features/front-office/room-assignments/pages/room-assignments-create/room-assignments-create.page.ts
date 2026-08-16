import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal
} from '@angular/core';

import {
  Router
} from '@angular/router';

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
  RoomAssignmentFormComponent,
  RoomAssignmentFormValue
} from '../../components/room-assignment-form/room-assignment-form.component';

import {
  RoomAssignmentsApiService
} from '../../data-access/room-assignments-api.service';

@Component({
  selector:
    'app-room-assignments-create-page',

  standalone:
    true,

  imports: [
    TranslationPipe,
    RoomAssignmentFormComponent
  ],

  templateUrl:
    './room-assignments-create.page.html',

  styleUrl:
    './room-assignments-create.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class RoomAssignmentsCreatePage {

  private readonly api =
    inject(RoomAssignmentsApiService);

  private readonly router =
    inject(Router);

  private readonly toast =
    inject(ToastService);

  private readonly translation =
    inject(TranslationService);

  readonly submitting =
    signal(false);

  submit(
    value: RoomAssignmentFormValue
  ): void {

    if (this.submitting()) {
      return;
    }

    this.submitting.set(true);

    this.api
      .create({
        branchId:
          value.branchId,

        referenceNumber:
          value.referenceNumber,

        title:
          value.title,

        notes:
          value.notes,

        amount:
          value.amount,

        eventAtUtc:
          value.eventAtUtc,

        relatedEntityId:
          value.relatedEntityId,

        relatedEntityType:
          value.relatedEntityType
      })
      .subscribe({

        next:
          () => {

            this.submitting.set(false);

            this.toast.success(
              this.translation.translate(
                'roomAssignments.createSuccess'
              )
            );

            void this.router.navigate([
              '/app/front-office/room-assignments'
            ]);
          },

        error:
          error => {

            this.submitting.set(false);

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'roomAssignments.createFailed'
                )
              )
            );
          }
      });
  }

  cancel(): void {

    if (this.submitting()) {
      return;
    }

    void this.router.navigate([
      '/app/front-office/room-assignments'
    ]);
  }
}
