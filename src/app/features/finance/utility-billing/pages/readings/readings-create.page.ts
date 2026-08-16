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
  LucideActivity
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  MeterReading,
  MeterReadingRequest
} from '../../models/meter-reading.model';

import {
  MeterReadingsApiService
} from '../../data-access/meter-readings-api.service';

@Component({
  selector:
    'app-readings-create-page',

  standalone:
    true,

  imports: [
    FormsModule,
    RouterLink,
    TranslationPipe,
    LucideArrowLeft,
    LucideSave,
    LucideActivity
  ],

  templateUrl:
    './readings-create.page.html',

  styleUrl:
    './readings-create.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class MeterReadingCreatePage {

  private readonly api =
    inject(MeterReadingsApiService);

  private readonly router =
    inject(Router);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly submitting =
    signal(false);


readonly meterId = signal('');
readonly currentReading = signal<number | null>(null);
readonly readingDate = signal('');
readonly notes = signal('');

buildRequest():
  MeterReadingRequest | null {

  if (
    !this.meterId().trim() ||
    this.currentReading() === null ||
    !this.readingDate()
  ) {
    return null;
  }

  return {
    meterId:
      this.meterId().trim(),

    currentReading:
      Number(
        this.currentReading()
      ),

    readingDateUtc:
      new Date(
        this.readingDate()
      ).toISOString(),

    notes:
      this.notes().trim() ||
      null
  };
}

loadFrom(
  item: MeterReading
): void {

  this.meterId.set(
    item.meterId ??
    ''
  );

  this.currentReading.set(
    item.currentReading ??
    null
  );

  if (
    item.readingDateUtc
  ) {
    const date =
      new Date(
        item.readingDateUtc
      );

    const local =
      new Date(
        date.getTime() -
        date.getTimezoneOffset() *
        60000
      );

    this.readingDate.set(
      local
        .toISOString()
        .slice(
          0,
          16
        )
    );
  }

  this.notes.set(
    item.notes ??
    ''
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
                '/app/finance/utility-billing/readings',
                item.id
              ]
            ),

        error:
          error =>
            console.error(
              'Create MeterReading error',
              error
            )
      });
  }
}
