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
  LeaveRequestFormComponent,
  LeaveRequestFormValue
} from '../../components/leave-request-form/leave-request-form.component';

import {
  LeaveRequestApiService
} from '../../data-access/leave-request-api.service';

import {
  LeaveRequestRecord
} from '../../models/leave-request.model';

@Component({
  selector: 'app-leave-request-edit.page',
  standalone: true,
  imports: [
    RouterLink,
    TranslationPipe,
    SpinComponent,
    LeaveRequestFormComponent,
    LucideArrowLeft
  ],
  templateUrl: './leave-request-edit.page.html',
  styleUrl: './leave-request-edit.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaveRequestEditPage
  implements OnInit {

  private readonly api =
    inject(
      LeaveRequestApiService
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

  readonly record =
    signal<LeaveRequestRecord | null>(
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
          'leaveRequests.missingId'
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
          record => {

            this.record.set(
              record
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
                  'leaveRequests.loadOneFailed'
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
    value: LeaveRequestFormValue
  ): void {

    const record =
      this.record();

    if (
      !record
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
        record.id,
        {
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
        }
      )
      .subscribe({
        next:
          updated => {

            this.toast.success(
              this.translation.translate(
                'leaveRequests.updateSuccess'
              )
            );

            void this.router.navigate([
              '/app/hr/leave-requests',
              updated.id
            ]);
          },
        error:
          error => {

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'leaveRequests.updateFailed'
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

    const record =
      this.record();

    void this.router.navigate(
      record
        ? [
          '/app/hr/leave-requests',
          record.id
        ]
        : [
          '/app/hr/leave-requests'
        ]
    );
  }

}
