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
  SecurityIncidentFormComponent,
  SecurityIncidentFormValue
} from '../../components/security-incident-form/security-incident-form.component';

import {
  SecurityIncidentsApiService
} from '../../data-access/security-incidents-api.service';

@Component({
  selector:
    'app-security-incidents-create-page',

  standalone:
    true,

  imports: [
    TranslationPipe,
    SecurityIncidentFormComponent
  ],

  templateUrl:
    './security-incidents-create.page.html',

  styleUrl:
    './security-incidents-create.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class SecurityIncidentsCreatePage {

  private readonly api =
    inject(SecurityIncidentsApiService);

  private readonly router =
    inject(Router);

  private readonly toast =
    inject(ToastService);

  private readonly translation =
    inject(TranslationService);

  readonly submitting =
    signal(false);

  submit(
    value: SecurityIncidentFormValue
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
          item => {

            this.submitting.set(false);

            this.toast.success(
              this.translation.translate(
                'securityIncidents.createSuccess'
              )
            );

            void this.router.navigate([
              '/app/operations/security-incidents',
              item.id
            ]);
          },

        error:
          error => {

            this.submitting.set(false);

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'securityIncidents.createFailed'
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
      '/app/operations/security-incidents'
    ]);
  }
}
