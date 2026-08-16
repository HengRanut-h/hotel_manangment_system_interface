import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal
} from '@angular/core';

import {
  DecimalPipe
} from '@angular/common';

import {
  LucideCalendar,
  LucideSave
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  CreateReservationRequest,
  GuestLookup,
  RoomLookup,
  RoomTypeLookup
} from '../../models/reservation.model';

@Component({
  selector:
    'app-reservation-form',

  standalone:
    true,

  imports: [
    DecimalPipe,
    TranslationPipe,
    LucideCalendar,
    LucideSave
  ],

  templateUrl:
    './reservation-form.component.html',

  styleUrl:
    './reservation-form.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class ReservationFormComponent {

  readonly guests =
    input<GuestLookup[]>([]);

  readonly roomTypes =
    input<RoomTypeLookup[]>([]);

  readonly rooms =
    input<RoomLookup[]>([]);

  readonly submitting =
    input(false);

  readonly submitted =
    output<CreateReservationRequest>();

  readonly guestId =
    signal('');

  readonly roomTypeId =
    signal('');

  readonly roomId =
    signal('');

  readonly checkInDate =
    signal(
      this.formatDate(
        new Date()
      )
    );

  readonly checkOutDate =
    signal(
      this.formatDate(
        this.addDays(
          new Date(),
          1
        )
      )
    );

  readonly adults =
    signal(1);

  readonly children =
    signal(0);

  readonly nightlyRate =
    signal(0);

  readonly touched =
    signal(false);

  readonly errorKey =
    signal('');

  readonly matchingRooms =
    computed(
      () => {

        const roomTypeId =
          this.roomTypeId();

        if (!roomTypeId) {
          return [];
        }

        return this.rooms()
          .filter(
            room =>
              room.roomTypeId
              === roomTypeId
          );
      }
    );

  readonly nights =
    computed(
      () =>
        this.calculateNights(
          this.checkInDate(),
          this.checkOutDate()
        )
    );

  readonly estimatedTotal =
    computed(
      () =>
        this.nights()
        *
        Math.max(
          0,
          this.nightlyRate()
        )
    );

  setGuest(
    event: Event
  ): void {

    const target =
      event.target;

    if (
      !(target instanceof HTMLSelectElement)
    ) {
      return;
    }

    this.guestId.set(
      target.value
    );

    this.clearError();
  }

  setRoomType(
    event: Event
  ): void {

    const target =
      event.target;

    if (
      !(target instanceof HTMLSelectElement)
    ) {
      return;
    }

    const id =
      target.value;

    this.roomTypeId.set(id);
    this.roomId.set('');

    const roomType =
      this.roomTypes()
        .find(
          item =>
            item.id === id
        );

    if (roomType) {
      this.nightlyRate.set(
        Math.max(
          0,
          roomType.baseRate
        )
      );
    }

    this.clearError();
  }

  setRoom(
    event: Event
  ): void {

    const target =
      event.target;

    if (
      !(target instanceof HTMLSelectElement)
    ) {
      return;
    }

    this.roomId.set(
      target.value
    );
  }

  setCheckInDate(
    event: Event
  ): void {

    const target =
      event.target;

    if (
      !(target instanceof HTMLInputElement)
    ) {
      return;
    }

    this.checkInDate.set(
      target.value
    );

    this.clearError();
  }

  setCheckOutDate(
    event: Event
  ): void {

    const target =
      event.target;

    if (
      !(target instanceof HTMLInputElement)
    ) {
      return;
    }

    this.checkOutDate.set(
      target.value
    );

    this.clearError();
  }

  setAdults(
    event: Event
  ): void {

    const target =
      event.target;

    if (
      !(target instanceof HTMLInputElement)
    ) {
      return;
    }

    this.adults.set(
      this.nonNegativeInteger(
        target.value,
        1
      )
    );
  }

  setChildren(
    event: Event
  ): void {

    const target =
      event.target;

    if (
      !(target instanceof HTMLInputElement)
    ) {
      return;
    }

    this.children.set(
      this.nonNegativeInteger(
        target.value,
        0
      )
    );
  }

  setNightlyRate(
    event: Event
  ): void {

    const target =
      event.target;

    if (
      !(target instanceof HTMLInputElement)
    ) {
      return;
    }

    const value =
      Number(
        target.value
      );

    this.nightlyRate.set(
      Number.isFinite(value)
        ? Math.max(0, value)
        : 0
    );
  }

  submit(): void {

    this.touched.set(true);

    if (
      this.submitting()
    ) {
      return;
    }

    const guestId =
      this.guestId()
        .trim();

    const roomTypeId =
      this.roomTypeId()
        .trim();

    const roomId =
      this.roomId()
        .trim();

    const checkInDate =
      this.checkInDate()
        .trim();

    const checkOutDate =
      this.checkOutDate()
        .trim();

    if (
      !guestId
      ||
      !roomTypeId
      ||
      !checkInDate
      ||
      !checkOutDate
    ) {
      this.errorKey.set(
        'reservations.requiredFields'
      );

      return;
    }

    if (
      this.nights() <= 0
    ) {
      this.errorKey.set(
        'reservations.invalidStayDates'
      );

      return;
    }

    if (
      this.adults() < 1
    ) {
      this.errorKey.set(
        'reservations.adultsRequired'
      );

      return;
    }

    if (
      this.nightlyRate() < 0
    ) {
      this.errorKey.set(
        'reservations.invalidRate'
      );

      return;
    }

    this.errorKey.set('');

    this.submitted.emit({
      guestId,
      roomTypeId,

      roomId:
        roomId
          ? roomId
          : null,

      checkInDate,
      checkOutDate,

      adults:
        this.adults(),

      children:
        this.children(),

      nightlyRate:
        this.nightlyRate()
    });
  }

  private clearError(): void {
    this.errorKey.set('');
  }

  private nonNegativeInteger(
    value: string,
    minimum: number
  ): number {

    const parsed =
      Number.parseInt(
        value,
        10
      );

    if (
      !Number.isFinite(parsed)
    ) {
      return minimum;
    }

    return Math.max(
      minimum,
      parsed
    );
  }

  private calculateNights(
    checkIn: string,
    checkOut: string
  ): number {

    if (
      !checkIn
      ||
      !checkOut
    ) {
      return 0;
    }

    const start =
      new Date(
        `${checkIn}T00:00:00`
      );

    const end =
      new Date(
        `${checkOut}T00:00:00`
      );

    const difference =
      end.getTime()
      -
      start.getTime();

    if (
      !Number.isFinite(difference)
      ||
      difference <= 0
    ) {
      return 0;
    }

    return Math.round(
      difference
      /
      86_400_000
    );
  }

  private formatDate(
    date: Date
  ): string {

    const year =
      date.getFullYear();

    const month =
      String(
        date.getMonth() + 1
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

    return `${year}-${month}-${day}`;
  }

  private addDays(
    date: Date,
    days: number
  ): Date {

    const copy =
      new Date(date);

    copy.setDate(
      copy.getDate()
      +
      days
    );

    return copy;
  }
}
