import {
  DatePipe,
  DecimalPipe
} from '@angular/common';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
  LucideCirclePlus,
  LucideCircleDollarSign,
  LucideClipboardList,
  LucideRefreshCw,
  LucideTriangleAlert,
  LucideX
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
  FolioChargeFormComponent
} from '../../components/folio-charge-form/folio-charge-form.component';

import {
  FoliosApiService
} from '../../data-access/folios-api.service';

import {
  AddFolioChargeRequest,
  Folio,
  ReservationLookup
} from '../../models/folio.model';

@Component({
  selector:
    'app-folios-detail-page',

  standalone:
    true,

  imports: [
    DatePipe,
    DecimalPipe,
    RouterLink,
    TranslationPipe,
    SpinComponent,
    FolioChargeFormComponent,
    LucideArrowLeft,
    LucideCheckCircle2,
    LucideCirclePlus,
    LucideCircleDollarSign,
    LucideClipboardList,
    LucideRefreshCw,
    LucideTriangleAlert,
    LucideX
  ],

  templateUrl:
    './folios-detail.page.html',

  styleUrl:
    './folios-detail.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class FoliosDetailPage
  implements OnInit {

  readonly auth =
    inject(AuthStore);

  private readonly route =
    inject(ActivatedRoute);

  private readonly api =
    inject(FoliosApiService);

  private readonly toast =
    inject(ToastService);

  private readonly translation =
    inject(TranslationService);

  readonly folio =
    signal<Folio | null>(null);

  readonly reservations =
    signal<ReservationLookup[]>([]);

  readonly loading =
    signal(true);

  readonly errorMessage =
    signal('');

  readonly showChargeModal =
    signal(false);

  readonly showCloseModal =
    signal(false);

  readonly addingCharge =
    signal(false);

  readonly closing =
    signal(false);

  readonly reservation =
    computed(
      () => {

        const folio =
          this.folio();

        if (!folio) {
          return null;
        }

        return this.reservations()
          .find(
            reservation =>
              reservation.id
              ===
              folio.reservationId
          )
        ??
        null;
      }
    );

  readonly activeCharges =
    computed(
      () =>
        this.folio()
          ?.charges
          .filter(
            charge =>
              !charge.isVoided
          )
        ??
        []
    );

  readonly voidedChargesCount =
    computed(
      () =>
        this.folio()
          ?.charges
          .filter(
            charge =>
              charge.isVoided
          )
          .length
        ??
        0
    );

  readonly recordedAmount =
    computed(
      () =>
        this.activeCharges()
          .reduce(
            (
              total,
              charge
            ) =>
              total
              +
              charge.amount,
            0
          )
    );


  ngOnInit(): void {

    this.loadReservations();
    this.load();
  }


  canMutate(): boolean {

    return (
      this.auth.hasPermission(
        'folios.update'
      )
      ||
      this.auth.hasPermission(
        'folios.manage'
      )
    );
  }


  load(): void {

    const id =
      this.route
        .snapshot
        .paramMap
        .get('id');

    if (!id) {
      this.loading.set(false);
      this.errorMessage.set(
        this.translation.translate(
          'folios.missingId'
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
          folio => {

            this.folio.set(
              folio
            );

            this.loading.set(false);
          },

        error:
          error => {

            this.errorMessage.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'folios.loadOneFailed'
                )
              )
            );

            this.loading.set(false);
          }
      });
  }


  private loadReservations(): void {

    this.api
      .getReservations()
      .subscribe({

        next:
          reservations => {

            this.reservations.set(
              reservations
            );
          },

        error:
          () => {

            this.reservations.set([]);
          }
      });
  }


  openChargeModal(): void {

    const folio =
      this.folio();

    if (
      !folio
      ||
      folio.isClosed
      ||
      !this.canMutate()
    ) {
      return;
    }

    this.showChargeModal.set(true);
  }


  closeChargeModal(): void {

    if (
      this.addingCharge()
    ) {
      return;
    }

    this.showChargeModal.set(false);
  }


  addCharge(
    request: AddFolioChargeRequest
  ): void {

    const folio =
      this.folio();

    if (
      !folio
      ||
      folio.isClosed
      ||
      !this.canMutate()
      ||
      this.addingCharge()
    ) {
      return;
    }

    this.addingCharge.set(true);

    this.api
      .addCharge(
        folio.id,
        request
      )
      .subscribe({

        next:
          () => {

            this.addingCharge.set(false);
            this.showChargeModal.set(false);

            this.toast.success(
              this.translation.translate(
                'folios.addChargeSuccess'
              )
            );

            this.load();
          },

        error:
          error => {

            this.addingCharge.set(false);

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'folios.addChargeFailed'
                )
              )
            );
          }
      });
  }


  requestClose(): void {

    const folio =
      this.folio();

    if (
      !folio
      ||
      folio.isClosed
      ||
      !this.canMutate()
    ) {
      return;
    }

    this.showCloseModal.set(true);
  }


  cancelClose(): void {

    if (
      this.closing()
    ) {
      return;
    }

    this.showCloseModal.set(false);
  }


  confirmClose(): void {

    const folio =
      this.folio();

    if (
      !folio
      ||
      folio.isClosed
      ||
      !this.canMutate()
      ||
      this.closing()
    ) {
      return;
    }

    this.closing.set(true);

    this.api
      .close(
        folio.id
      )
      .subscribe({

        next:
          () => {

            this.closing.set(false);
            this.showCloseModal.set(false);

            this.toast.success(
              this.translation.translate(
                'folios.closeSuccess'
              )
            );

            this.load();
          },

        error:
          error => {

            this.closing.set(false);

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'folios.closeFailed'
                )
              )
            );
          }
      });
  }
}
