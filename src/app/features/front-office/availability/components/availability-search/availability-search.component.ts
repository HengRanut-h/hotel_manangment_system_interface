import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal
} from '@angular/core';

import {
  LucideCalendar,
  LucideSearch,
  LucideX
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  AvailabilityQuery,
  AvailabilityRoomTypeOption
} from '../../models/availability.model';

@Component({
  selector:
    'app-availability-search',

  standalone:
    true,

  imports: [
    TranslationPipe,

    LucideCalendar,
    LucideSearch,
    LucideX
  ],

  templateUrl:
    './availability-search.component.html',

  styleUrl:
    './availability-search.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class AvailabilitySearchComponent {

  // =========================================================
  // INPUTS
  // =========================================================

  readonly submitting =
    input(false);


  readonly roomTypes =
    input<
      AvailabilityRoomTypeOption[]
    >(
      []
    );


  readonly roomTypesLoading =
    input(false);


  // =========================================================
  // OUTPUT
  // =========================================================

  readonly searched =
    output<AvailabilityQuery>();


  // =========================================================
  // FORM STATE
  // =========================================================

  readonly checkIn =
    signal(
      this.formatDate(
        new Date()
      )
    );


  readonly checkOut =
    signal(
      this.formatDate(
        this.addDays(
          new Date(),
          1
        )
      )
    );


  readonly roomTypeId =
    signal('');


  readonly errorKey =
    signal('');


  // =========================================================
  // CHECK-IN
  // =========================================================

  setCheckIn(
    event: Event
  ): void {

    const target =
      event.target;


    if (
      !(
        target instanceof
        HTMLInputElement
      )
    ) {

      return;
    }


    this.checkIn.set(
      target.value
    );


    this.errorKey.set(
      ''
    );
  }


  // =========================================================
  // CHECK-OUT
  // =========================================================

  setCheckOut(
    event: Event
  ): void {

    const target =
      event.target;


    if (
      !(
        target instanceof
        HTMLInputElement
      )
    ) {

      return;
    }


    this.checkOut.set(
      target.value
    );


    this.errorKey.set(
      ''
    );
  }


  // =========================================================
  // ROOM TYPE
  // =========================================================

  setRoomType(
    event: Event
  ): void {

    const target =
      event.target;


    if (
      !(
        target instanceof
        HTMLSelectElement
      )
    ) {

      return;
    }


    this.roomTypeId.set(
      target.value
    );
  }


  // =========================================================
  // SUBMIT
  // =========================================================

  submit(): void {

    if (
      this.submitting()
    ) {

      return;
    }


    const checkIn =
      this.checkIn()
        .trim();


    const checkOut =
      this.checkOut()
        .trim();


    // =====================================================
    // REQUIRED
    // =====================================================

    if (
      !checkIn
      ||
      !checkOut
    ) {

      this.errorKey.set(
        'availability.datesRequired'
      );

      return;
    }


    // =====================================================
    // VALID DATES
    // =====================================================

    const checkInDate =
      this.toDate(
        checkIn
      );


    const checkOutDate =
      this.toDate(
        checkOut
      );


    if (
      !checkInDate
      ||
      !checkOutDate
    ) {

      this.errorKey.set(
        'availability.invalidDates'
      );

      return;
    }


    // =====================================================
    // CHECK-OUT AFTER CHECK-IN
    // =====================================================

    if (
      checkOutDate.getTime()
      <=
      checkInDate.getTime()
    ) {

      this.errorKey.set(
        'availability.checkOutAfterCheckIn'
      );

      return;
    }


    this.errorKey.set(
      ''
    );


    // =====================================================
    // EMIT
    // =====================================================

    this.searched.emit({

      checkIn,

      checkOut,

      roomTypeId:
        this.roomTypeId()
          ||
        null
    });
  }


  // =========================================================
  // RESET
  // =========================================================

  reset(): void {

    if (
      this.submitting()
    ) {

      return;
    }


    const today =
      new Date();


    this.checkIn.set(
      this.formatDate(
        today
      )
    );


    this.checkOut.set(
      this.formatDate(
        this.addDays(
          today,
          1
        )
      )
    );


    this.roomTypeId.set(
      ''
    );


    this.errorKey.set(
      ''
    );
  }


  // =========================================================
  // FORMAT DATE
  // =========================================================

  private formatDate(
    date: Date
  ): string {

    const year =
      date.getFullYear();


    const month =
      String(
        date.getMonth()
        +
        1
      )
        .padStart(
          2,
          '0'
        );


    const day =
      String(
        date.getDate()
      )
        .padStart(
          2,
          '0'
        );


    return (
      `${year}-${month}-${day}`
    );
  }


  // =========================================================
  // ADD DAYS
  // =========================================================

  private addDays(
    date: Date,
    days: number
  ): Date {

    const copy =
      new Date(
        date
      );


    copy.setDate(
      copy.getDate()
      +
      days
    );


    return copy;
  }


  // =========================================================
  // TO DATE
  // =========================================================

  private toDate(
    value: string
  ): Date | null {

    const parts =
      value
        .split('-')
        .map(
          Number
        );


    if (
      parts.length !== 3
      ||
      parts.some(
        part =>
          !Number.isFinite(
            part
          )
      )
    ) {

      return null;
    }


    const [
      year,
      month,
      day
    ] =
      parts;


    const date =
      new Date(
        year,
        month - 1,
        day
      );


    if (
      date.getFullYear()
        !== year
      ||
      date.getMonth()
        !== month - 1
      ||
      date.getDate()
        !== day
    ) {

      return null;
    }


    return date;
  }
}
