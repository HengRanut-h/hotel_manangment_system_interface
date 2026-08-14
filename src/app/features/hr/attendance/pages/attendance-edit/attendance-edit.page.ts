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
  AttendanceFormComponent,
  AttendanceFormValue
} from '../../components/attendance-form/attendance-form.component';

import {
  AttendanceApiService
} from '../../data-access/attendance-api.service';

import {
  AttendanceRecord
} from '../../models/attendance.model';

@Component({
  selector: 'app-attendance-edit.page',
  standalone: true,
  imports: [
    RouterLink,
    TranslationPipe,
    SpinComponent,
    AttendanceFormComponent,
    LucideArrowLeft
  ],
  templateUrl: './attendance-edit.page.html',
  styleUrl: './attendance-edit.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttendanceEditPage
  implements OnInit {

  private readonly api =
    inject(
      AttendanceApiService
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
    signal<AttendanceRecord | null>(
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
          'attendance.missingId'
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
                  'attendance.loadOneFailed'
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
    value: AttendanceFormValue
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
                'attendance.updateSuccess'
              )
            );

            void this.router.navigate([
              '/app/hr/attendance',
              updated.id
            ]);
          },
        error:
          error => {

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'attendance.updateFailed'
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
          '/app/hr/attendance',
          record.id
        ]
        : [
          '/app/hr/attendance'
        ]
    );
  }

}
