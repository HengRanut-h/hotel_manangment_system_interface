import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  Router,
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
  LucideSave,
  LucideGauge
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  UtilityMeter,
  UtilityMeterRequest
} from '../../models/utility-meter.model';

import {
  UtilityMetersApiService
} from '../../data-access/utility-meters-api.service';

@Component({
  selector:
    'app-meters-create-page',

  standalone:
    true,

  imports: [
    FormsModule,
    RouterLink,
    TranslationPipe,
    LucideArrowLeft,
    LucideSave,
    LucideGauge
  ],

  templateUrl:
    './meters-create.page.html',

  styleUrl:
    './meters-create.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class UtilityMeterCreatePage {

  private readonly api =
    inject(UtilityMetersApiService);

  private readonly router =
    inject(Router);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly submitting =
    signal(false);


readonly utilityId = signal('');
readonly meterNumber = signal('');
readonly roomId = signal('');
readonly location = signal('');
readonly initialReading = signal<number | null>(0);
readonly installedAt = signal('');
readonly isActive = signal(true);

buildRequest():
  UtilityMeterRequest | null {

  if (
    !this.utilityId().trim() ||
    !this.meterNumber().trim()
  ) {
    return null;
  }

  return {
    utilityId:
      this.utilityId().trim(),

    meterNumber:
      this.meterNumber().trim(),

    roomId:
      this.roomId().trim() ||
      null,

    location:
      this.location().trim() ||
      null,

    initialReading:
      this.initialReading(),

    installedAtUtc:
      this.installedAt()
        ? new Date(
            this.installedAt()
          ).toISOString()
        : null,

    isActive:
      this.isActive()
  };
}

loadFrom(
  item: UtilityMeter
): void {

  this.utilityId.set(
    item.utilityId ??
    ''
  );

  this.meterNumber.set(
    item.meterNumber ??
    ''
  );

  this.roomId.set(
    item.roomId ??
    ''
  );

  this.location.set(
    item.location ??
    ''
  );

  this.initialReading.set(
    item.initialReading ??
    0
  );

  this.isActive.set(
    item.isActive ??
    true
  );
}


  save(): void {

    const request =
      this.buildRequest();

    if (
      !request
    ) {
      return;
    }

    this.submitting.set(
      true
    );

    this.api
      .create(
        request
      )
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        ),

        finalize(
          () =>
            this.submitting.set(
              false
            )
        )
      )
      .subscribe({
        next:
          item =>
            this.router.navigate(
              [
                '/app/finance/utility-billing/meters',
                item.id
              ]
            ),

        error:
          error =>
            console.error(
              'Create UtilityMeter error',
              error
            )
      });
  }
}
