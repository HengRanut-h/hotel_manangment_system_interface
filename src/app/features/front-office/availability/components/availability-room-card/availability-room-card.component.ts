import {
  ChangeDetectionStrategy,
  Component,
  input
} from '@angular/core';

import {
  DecimalPipe
} from '@angular/common';

import {
  LucideBed
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  AvailabilityRoom
} from '../../models/availability.model';

@Component({
  selector:
    'app-availability-room-card',

  standalone:
    true,

  imports: [
    DecimalPipe,
    TranslationPipe,
    LucideBed
  ],

  templateUrl:
    './availability-room-card.component.html',

  styleUrl:
    './availability-room-card.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class AvailabilityRoomCardComponent {

  readonly room =
    input.required<
      AvailabilityRoom
    >();


  // =========================================================
  // AVAILABLE
  // =========================================================

  isAvailable(): boolean {

    return (
      this.room()
        .status
        .trim()
        .toLowerCase()
      ===
      'available'
    );
  }
}
