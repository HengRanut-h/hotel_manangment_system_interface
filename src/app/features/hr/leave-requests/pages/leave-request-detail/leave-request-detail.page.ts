import {
  DatePipe
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
  LucidePencil
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
  LeaveRequestApiService
} from '../../data-access/leave-request-api.service';

import {
  LeaveRequestRecord
} from '../../models/leave-request.model';

@Component({
  selector: 'app-leave-request-detail.page',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe,
    TranslationPipe,
    SpinComponent,
    LucideArrowLeft,
    LucidePencil
  ],
  templateUrl: './leave-request-detail.page.html',
  styleUrl: './leave-request-detail.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaveRequestDetailPage
  implements OnInit {

  readonly auth =
    inject(
      AuthStore
    );

  private readonly api =
    inject(
      LeaveRequestApiService
    );

  private readonly route =
    inject(
      ActivatedRoute
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

            this.record.set(
              null
            );

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

  statusLabel(
    status: string
  ): string {

    const normalized =
      status.toLowerCase();

    if (
      [
        'pending',
        'approved',
        'rejected',
        'cancelled'
      ].includes(
        normalized
      )
    ) {
      return this.translation.translate(
        `leaveRequests.statuses.${normalized}`
      );
    }

    return status;
  }

}
