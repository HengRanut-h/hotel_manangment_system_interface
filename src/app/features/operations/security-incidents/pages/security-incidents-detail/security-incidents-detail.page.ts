import {
  DatePipe,
  DecimalPipe
} from '@angular/common';

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import {
  LucideArrowLeft,
  LucideCheckCircle2,
  LucideClipboardList,
  LucidePencil,
  LucideRefreshCw
} from '@lucide/angular';

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
  SecurityIncidentStatusBadgeComponent
} from '../../components/security-incident-status-badge/security-incident-status-badge.component';

import {
  SecurityIncidentsApiService
} from '../../data-access/security-incidents-api.service';

import {
  SecurityIncident
} from '../../models/security-incident.model';

@Component({
  selector:
    'app-security-incidents-detail-page',

  standalone:
    true,

  imports: [
    DatePipe,
    DecimalPipe,
    RouterLink,
    TranslationPipe,
    SpinComponent,
    SecurityIncidentStatusBadgeComponent,
    LucideArrowLeft,
    LucideCheckCircle2,
    LucideClipboardList,
    LucidePencil,
    LucideRefreshCw
  ],

  templateUrl:
    './security-incidents-detail.page.html',

  styleUrl:
    './security-incidents-detail.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class SecurityIncidentsDetailPage
  implements OnInit {

  readonly auth =
    inject(AuthStore);

  private readonly api =
    inject(SecurityIncidentsApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly toast =
    inject(ToastService);

  private readonly translation =
    inject(TranslationService);

  readonly item =
    signal<SecurityIncident | null>(null);

  readonly loading =
    signal(true);

  readonly errorMessage =
    signal('');

  readonly statusDraft =
    signal('');

  readonly updatingStatus =
    signal(false);

  ngOnInit(): void {

    this.load();
  }

  load(): void {

    const id =
      this.route.snapshot.paramMap
        .get('id');

    if (!id) {
      this.loading.set(false);

      this.errorMessage.set(
        this.translation.translate(
          'securityIncidents.missingId'
        )
      );

      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.api
      .getById(id)
      .subscribe({

        next:
          item => {

            this.item.set(item);

            this.statusDraft.set(
              item.status
            );

            this.loading.set(false);
          },

        error:
          error => {

            this.errorMessage.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'securityIncidents.loadOneFailed'
                )
              )
            );

            this.loading.set(false);
          }
      });
  }

  setStatusDraft(
    event: Event
  ): void {

    const target =
      event.target;

    if (
      !(target instanceof HTMLInputElement)
    ) {
      return;
    }

    this.statusDraft.set(
      target.value
    );
  }

  saveStatus(): void {

    const item =
      this.item();

    const status =
      this.statusDraft()
        .trim();

    if (
      !item
      ||
      !status
      ||
      this.updatingStatus()
      ||
      !this.auth.hasPermission(
        'security-incidents.update'
      )
    ) {
      return;
    }

    this.updatingStatus.set(true);

    this.api
      .changeStatus(
        item.id,
        {
          status
        }
      )
      .subscribe({

        next:
          updated => {

            this.item.set(updated);
            this.statusDraft.set(
              updated.status
            );

            this.updatingStatus.set(false);

            this.toast.success(
              this.translation.translate(
                'securityIncidents.statusUpdateSuccess'
              )
            );
          },

        error:
          error => {

            this.updatingStatus.set(false);

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'securityIncidents.statusUpdateFailed'
                )
              )
            );
          }
      });
  }
}
