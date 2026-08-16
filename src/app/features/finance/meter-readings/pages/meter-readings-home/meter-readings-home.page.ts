import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  RouterLink
} from '@angular/router';

import {
  finalize
} from 'rxjs';

import {
  takeUntilDestroyed
} from '@angular/core/rxjs-interop';

import {
  LucideGauge,
  LucideSearch,
  LucideRefreshCw,
  LucidePlus,
  LucideActivity,
  LucideDroplets,
  LucideCircleDollarSign,
  LucideFileSearch
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  MeterReading
} from '../../models/meter-reading.model';

import {
  MeterReadingsApiService
} from '../../data-access/meter-readings-api.service';

@Component({
  selector:
    'app-meter-readings-home-page',

  standalone:
    true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink,

    LucideGauge,
    LucideSearch,
    LucideRefreshCw,
    LucidePlus,
    LucideActivity,
    LucideDroplets,
    LucideCircleDollarSign,
    LucideFileSearch,
    TranslationPipe
  ],

  templateUrl:
    './meter-readings-home.page.html',

  styleUrl:
    './meter-readings-home.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class MeterReadingsHomePage {

  private readonly api =
    inject(MeterReadingsApiService);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly meterId =
    signal('');

  readonly items =
    signal<MeterReading[]>([]);

  readonly loading =
    signal(false);

  readonly loaded =
    signal(false);

  readonly error =
    signal(false);

  readonly latest =
    computed<MeterReading | null>(() => {

      const rows =
        [...this.items()]
          .sort(
            (a, b) =>
              new Date(
                b.readingDateUtc
              ).getTime() -
              new Date(
                a.readingDateUtc
              ).getTime()
          );

      return rows.length > 0
        ? rows[0]
        : null;
    });

  readonly totalUsage =
    computed(
      () =>
        this.items()
          .reduce(
            (
              total,
              item
            ) =>
              total +
              Number(
                item.usage ??
                0
              ),
            0
          )
    );

  readonly totalAmount =
    computed(
      () =>
        this.items()
          .reduce(
            (
              total,
              item
            ) =>
              total +
              Number(
                item.amount ??
                0
              ),
            0
          )
    );

  load(): void {

    const meterId =
      this.meterId()
        .trim();

    if (
      !meterId
    ) {
      return;
    }

    this.loading.set(
      true
    );

    this.loaded.set(
      false
    );

    this.error.set(
      false
    );

    this.api
      .getByMeterId(
        meterId
      )
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        ),

        finalize(
          () => {
            this.loading.set(
              false
            );

            this.loaded.set(
              true
            );
          }
        )
      )
      .subscribe({
        next:
          items =>
            this.items.set(
              items ??
              []
            ),

        error:
          error => {

            console.error(
              'Load meter readings error',
              error
            );

            this.items.set(
              []
            );

            this.error.set(
              true
            );
          }
      });
  }
}
