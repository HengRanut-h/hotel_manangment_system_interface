import {
  DatePipe
} from '@angular/common';

import {
  ChangeDetectionStrategy,
  Component,
  input,
  output
} from '@angular/core';

import {
  LucideBed,
  LucideCalendarDays,
  LucideLogIn,
  LucideUsers
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  CheckInReservation
} from '../../models/check-in.model';

import {
  CheckInStatusBadgeComponent
} from '../check-in-status-badge/check-in-status-badge.component';

@Component({
  selector:
    'app-check-in-reservation-card',

  standalone:
    true,

  imports: [
    DatePipe,
    TranslationPipe,
    CheckInStatusBadgeComponent,
    LucideBed,
    LucideCalendarDays,
    LucideLogIn,
    LucideUsers
  ],

  templateUrl:
    './check-in-reservation-card.component.html',

  styleUrl:
    './check-in-reservation-card.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class CheckInReservationCardComponent {

  readonly reservation =
    input.required<CheckInReservation>();

  readonly canCheckIn =
    input(false);

  readonly processing =
    input(false);

  readonly checkInRequested =
    output<CheckInReservation>();

  requestCheckIn(): void {

    if (
      this.processing()
      ||
      !this.canCheckIn()
    ) {
      return;
    }

    this.checkInRequested.emit(
      this.reservation()
    );
  }
}
