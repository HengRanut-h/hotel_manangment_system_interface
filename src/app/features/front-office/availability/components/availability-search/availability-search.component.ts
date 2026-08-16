import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal
} from '@angular/core';

import {
  LucideCalendar,
  LucideSearch
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  AvailabilityQuery
} from '../../models/availability.model';

@Component({
  selector: 'app-availability-search',
  standalone: true,
  imports: [
    TranslationPipe,
    LucideCalendar,
    LucideSearch
  ],
  templateUrl: './availability-search.component.html',
  styleUrl: './availability-search.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvailabilitySearchComponent {
  readonly submitting = input(false);
  readonly searched = output<AvailabilityQuery>();

  readonly checkInDate = signal(
    this.formatDate(new Date())
  );

  readonly checkOutDate = signal(
    this.formatDate(
      this.addDays(new Date(), 1)
    )
  );

  readonly errorKey = signal('');

  setCheckInDate(event: Event): void {
    const target = event.target;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    this.checkInDate.set(target.value);
    this.errorKey.set('');
  }

  setCheckOutDate(event: Event): void {
    const target = event.target;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    this.checkOutDate.set(target.value);
    this.errorKey.set('');
  }

  submit(): void {
    if (this.submitting()) {
      return;
    }

    const checkInDate = this.checkInDate().trim();
    const checkOutDate = this.checkOutDate().trim();

    if (!checkInDate || !checkOutDate) {
      this.errorKey.set('availability.datesRequired');
      return;
    }

    const checkIn = this.toDate(checkInDate);
    const checkOut = this.toDate(checkOutDate);

    if (!checkIn || !checkOut) {
      this.errorKey.set('availability.invalidDates');
      return;
    }

    if (checkOut.getTime() <= checkIn.getTime()) {
      this.errorKey.set(
        'availability.checkOutAfterCheckIn'
      );
      return;
    }

    this.errorKey.set('');

    this.searched.emit({
      checkInDate,
      checkOutDate
    });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(
      date.getMonth() + 1
    ).padStart(2, '0');
    const day = String(
      date.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private addDays(date: Date, days: number): Date {
    const copy = new Date(date);
    copy.setDate(copy.getDate() + days);
    return copy;
  }

  private toDate(value: string): Date | null {
    const parts = value
      .split('-')
      .map(Number);

    if (
      parts.length !== 3 ||
      parts.some(part => !Number.isFinite(part))
    ) {
      return null;
    }

    const [year, month, day] = parts;

    const date = new Date(
      year,
      month - 1,
      day
    );

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    return date;
  }
}
