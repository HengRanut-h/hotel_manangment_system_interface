import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
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
  SpinComponent
} from '../../../../../shared/ui/spin/spin.component';

import {
  ToastService
} from '../../../../../shared/ui/toast/toast.service';

import {
  GuestRequestFormComponent,
  GuestRequestFormValue
} from '../../components/guest-request-form/guest-request-form.component';

import {
  GuestRequestsApiService
} from '../../data-access/guest-requests-api.service';

import {
  GuestRequest
} from '../../models/guest-request.model';

@Component({
  selector:
    'app-guest-requests-edit-page',

  standalone:
    true,

  imports: [
    TranslationPipe,
    SpinComponent,
    GuestRequestFormComponent
  ],

  templateUrl:
    './guest-requests-edit.page.html',

  styleUrl:
    './guest-requests-edit.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class GuestRequestsEditPage
  implements OnInit {

  private readonly api =
    inject(GuestRequestsApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly toast =
    inject(ToastService);

  private readonly translation =
    inject(TranslationService);

  readonly item =
    signal<GuestRequest | null>(null);

  readonly loading =
    signal(true);

  readonly submitting =
    signal(false);

  readonly errorMessage =
    signal('');

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
          'guestRequests.missingId'
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
            this.loading.set(false);
          },

        error:
          error => {

            this.errorMessage.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'guestRequests.loadOneFailed'
                )
              )
            );

            this.loading.set(false);
          }
      });
  }

  submit(
    value: GuestRequestFormValue
  ): void {

    const item =
      this.item();

    if (
      !item
      ||
      this.submitting()
    ) {
      return;
    }

    this.submitting.set(true);

    this.api
      .update(
        item.id,
        {
          branchId:
            value.branchId,

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

            this.submitting.set(false);

            this.toast.success(
              this.translation.translate(
                'guestRequests.updateSuccess'
              )
            );

            void this.router.navigate([
              '/app/operations/guest-requests',
              updated.id
            ]);
          },

        error:
          error => {

            this.submitting.set(false);

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'guestRequests.updateFailed'
                )
              )
            );
          }
      });
  }

  cancel(): void {

    const item =
      this.item();

    void this.router.navigate(
      item
        ? [
            '/app/operations/guest-requests',
            item.id
          ]
        : [
            '/app/operations/guest-requests'
          ]
    );
  }
}
