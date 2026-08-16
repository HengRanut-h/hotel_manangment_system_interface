import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';
import {
  finalize
} from 'rxjs';
import {
  takeUntilDestroyed
} from '@angular/core/rxjs-interop';
import {
  LucideArrowLeft,
  LucideBookOpen,
  LucideRefreshCw,
  LucidePlus,
  LucideLockKeyhole
} from '@lucide/angular';
import {
  AddFolioChargeRequest,
  Folio
} from '../../models/folio.model';
import {
  FoliosApiService
} from '../../data-access/folios-api.service';
import {
  FolioStatusBadgeComponent
} from '../../components/folio-status-badge/folio-status-badge.component';
import {
  FolioChargeFormComponent
} from '../../components/folio-charge-form/folio-charge-form.component';

@Component({
  selector: 'app-folios-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FolioStatusBadgeComponent,
    FolioChargeFormComponent,
    LucideArrowLeft,
    LucideBookOpen,
    LucideRefreshCw,
    LucidePlus,
    LucideLockKeyhole
  ],
  templateUrl:
    './folios-detail.page.html',
  styleUrl:
    './folios-detail.page.css',
  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class FoliosDetailPage {
  private readonly api =
    inject(FoliosApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly item =
    signal<Folio | null>(null);

  readonly loading =
    signal(false);

  readonly actionLoading =
    signal(false);

  readonly chargeOpen =
    signal(false);

  readonly error =
    signal(false);

  readonly id =
    this.route.snapshot.paramMap.get(
      'id'
    );

  readonly charges =
    computed(
      () =>
        this.item()?.charges ?? []
    );

  readonly total =
    computed(
      () =>
        this.charges()
          .filter(
            charge =>
              !charge.isVoided
          )
          .reduce(
            (sum, charge) =>
              sum +
              Number(charge.amount || 0),
            0
          )
    );

  constructor() {
    if (this.id) {
      this.load();
    } else {
      this.error.set(true);
    }
  }

  load(): void {
    if (!this.id) {
      return;
    }

    this.loading.set(true);
    this.error.set(false);

    this.api
      .getById(this.id)
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        ),
        finalize(
          () =>
            this.loading.set(false)
        )
      )
      .subscribe({
        next:
          folio =>
            this.item.set(folio),
        error:
          error => {
            console.error(
              'Load folio error',
              error
            );
            this.error.set(true);
          }
      });
  }

  addCharge(
    request: AddFolioChargeRequest
  ): void {
    const folio =
      this.item();

    if (
      !folio ||
      folio.isClosed ||
      this.actionLoading()
    ) {
      return;
    }

    this.actionLoading.set(true);
    this.error.set(false);

    this.api
      .addCharge(
        folio.id,
        request
      )
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        ),
        finalize(
          () =>
            this.actionLoading.set(false)
        )
      )
      .subscribe({
        next:
          () => {
            this.chargeOpen.set(false);
            this.load();
          },
        error:
          error => {
            console.error(
              'Add charge error',
              error
            );
            this.error.set(true);
          }
      });
  }

  closeFolio(): void {
    const folio =
      this.item();

    if (
      !folio ||
      folio.isClosed ||
      this.actionLoading()
    ) {
      return;
    }

    if (
      !window.confirm(
        `Close folio "${folio.folioNumber}"?`
      )
    ) {
      return;
    }

    this.actionLoading.set(true);
    this.error.set(false);

    this.api
      .close(folio.id)
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        ),
        finalize(
          () =>
            this.actionLoading.set(false)
        )
      )
      .subscribe({
        next:
          () =>
            this.load(),
        error:
          error => {
            console.error(
              'Close folio error',
              error
            );
            this.error.set(true);
          }
      });
  }
}
