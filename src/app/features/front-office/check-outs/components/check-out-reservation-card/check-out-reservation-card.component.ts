import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LucideBed, LucideCalendarDays, LucideLogOut, LucideUsers } from '@lucide/angular';
import { TranslationPipe } from '../../../../../core/i18n/translation.pipe';
import { CheckOutReservation } from '../../models/check-out.model';
import { CheckOutStatusBadgeComponent } from '../check-out-status-badge/check-out-status-badge.component';

@Component({
  selector: 'app-check-out-reservation-card',
  standalone: true,
  imports: [
    DatePipe,
    TranslationPipe,
    CheckOutStatusBadgeComponent,
    LucideBed,
    LucideCalendarDays,
    LucideLogOut,
    LucideUsers
  ],
  templateUrl: './check-out-reservation-card.component.html',
  styleUrl: './check-out-reservation-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckOutReservationCardComponent {
  readonly reservation = input.required<CheckOutReservation>();
  readonly canCheckOut = input(false);
  readonly processing = input(false);
  readonly checkOutRequested = output<CheckOutReservation>();

  requestCheckOut(): void {
    if (this.processing() || !this.canCheckOut()) return;
    this.checkOutRequested.emit(this.reservation());
  }
}
