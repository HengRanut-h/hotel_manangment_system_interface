import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  LucideArrowLeft,
  LucideBedDouble,
  LucideCalendarDays,
  LucideCheck,
  LucideClipboardList,
  LucideUserRound
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  RoomAssignmentsApiService
} from '../../data-access/room-assignments-api.service';

import {
  ReservationLookup
} from '../../models/room-assignment.model';

export interface RoomAssignmentFormValue {
  branchId: string | null;
  referenceNumber: string;
  title: string;
  notes: string | null;
  amount: number | null;
  eventAtUtc: string | null;
  relatedEntityId: string | null;
  relatedEntityType: string | null;
}

@Component({
  selector:
    'app-room-assignment-form',

  standalone:
    true,

  imports: [
    FormsModule,
    TranslationPipe,
    LucideArrowLeft,
    LucideBedDouble,
    LucideCalendarDays,
    LucideCheck,
    LucideClipboardList,
    LucideUserRound
  ],

  templateUrl:
    './room-assignment-form.component.html',

  styleUrl:
    './room-assignment-form.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class RoomAssignmentFormComponent {

  private readonly api =
    inject(RoomAssignmentsApiService);

  readonly initialBranchId =
    input<string | null>(null);

  readonly initialReferenceNumber =
    input('');

  readonly initialTitle =
    input('');

  readonly initialNotes =
    input<string | null>(null);

  readonly initialAmount =
    input<number | null>(null);

  readonly initialEventAtUtc =
    input<string | null>(null);

  readonly initialRelatedEntityId =
    input<string | null>(null);

  readonly initialRelatedEntityType =
    input<string | null>(null);

  readonly showReferenceNumber =
    input(true);

  readonly submitting =
    input(false);

  readonly submitLabel =
    input('roomAssignments.save');

  readonly submitted =
    output<RoomAssignmentFormValue>();

  readonly cancelled =
    output<void>();

  readonly reservations =
    signal<ReservationLookup[]>([]);

  readonly reservationsLoading =
    signal(false);

  readonly referenceNumber =
    signal('');

  readonly title =
    signal('');

  readonly notes =
    signal('');

  readonly amount =
    signal('');

  readonly eventAtUtc =
    signal('');

  readonly relatedEntityId =
    signal('');

  readonly touched =
    signal(false);

  readonly selectedReservation =
    computed(
      () =>
        this.reservations()
          .find(
            item =>
              item.id
              ===
              this.relatedEntityId()
          )
        ??
        null
    );

  constructor() {

    this.loadReservations();

    effect(
      () => {
        this.referenceNumber.set(
          this.initialReferenceNumber()
        );

        this.title.set(
          this.initialTitle()
        );

        this.notes.set(
          this.initialNotes()
          ??
          ''
        );

        this.amount.set(
          this.initialAmount() === null
            ? ''
            : String(
                this.initialAmount()
              )
        );

        this.eventAtUtc.set(
          this.toLocalDateTime(
            this.initialEventAtUtc()
          )
        );

        this.relatedEntityId.set(
          this.initialRelatedEntityType()
            ?.trim()
            .toLowerCase()
          === 'reservation'
            ? (
                this.initialRelatedEntityId()
                ??
                ''
              )
            : ''
        );
      },
      {
        allowSignalWrites:
          true
      }
    );
  }

  isTitleInvalid(): boolean {
    return (
      this.touched()
      &&
      !this.title().trim()
    );
  }

  isReferenceNumberInvalid():
    boolean {
    return (
      this.showReferenceNumber()
      &&
      this.touched()
      &&
      !this.referenceNumber().trim()
    );
  }

  submit(): void {
    this.touched.set(true);

    if (
      this.submitting()
      ||
      this.isTitleInvalid()
      ||
      this.isReferenceNumberInvalid()
    ) {
      return;
    }

    const amountText =
      this.amount().trim();

    const amount =
      amountText
        ? Number(amountText)
        : null;

    if (
      amount !== null
      &&
      !Number.isFinite(amount)
    ) {
      return;
    }

    const relatedEntityId =
      this.normalizeOptional(
        this.relatedEntityId()
      );

    this.submitted.emit({
      branchId:
        this.initialBranchId(),
      referenceNumber:
        this.referenceNumber().trim(),
      title:
        this.title().trim(),
      notes:
        this.normalizeOptional(
          this.notes()
        ),
      amount,
      eventAtUtc:
        this.normalizeDateTime(
          this.eventAtUtc()
        ),
      relatedEntityId,
      relatedEntityType:
        relatedEntityId
          ? 'Reservation'
          : null
    });
  }

  cancel(): void {
    if (this.submitting()) {
      return;
    }

    this.cancelled.emit();
  }

  setReferenceNumber(
    event: Event
  ): void {
    const target =
      event.target;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    this.referenceNumber.set(
      target.value
    );
  }

  setTitle(
    event: Event
  ): void {
    const target =
      event.target;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    this.title.set(
      target.value
    );
  }

  setNotes(
    event: Event
  ): void {
    const target =
      event.target;

    if (!(target instanceof HTMLTextAreaElement)) {
      return;
    }

    this.notes.set(
      target.value
    );
  }

  setAmount(
    event: Event
  ): void {
    const target =
      event.target;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    this.amount.set(
      target.value
    );
  }

  setEventAtUtc(
    event: Event
  ): void {
    const target =
      event.target;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    this.eventAtUtc.set(
      target.value
    );
  }

  setReservation(
    event: Event
  ): void {
    const target =
      event.target;

    if (!(target instanceof HTMLSelectElement)) {
      return;
    }

    this.relatedEntityId.set(
      target.value
    );
  }

  private loadReservations():
    void {
    this.reservationsLoading.set(true);

    this.api
      .getReservations()
      .subscribe({
        next:
          items => {
            this.reservations.set(
              Array.isArray(items)
                ? items
                : []
            );

            this.reservationsLoading.set(false);
          },
        error:
          () => {
            this.reservations.set([]);
            this.reservationsLoading.set(false);
          }
      });
  }

  private normalizeOptional(
    value: string
  ): string | null {
    const normalized =
      value.trim();

    return normalized
      ? normalized
      : null;
  }

  private normalizeDateTime(
    value: string
  ): string | null {
    const normalized =
      value.trim();

    if (!normalized) {
      return null;
    }

    const date =
      new Date(normalized);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return normalized;
    }

    return date.toISOString();
  }

  private toLocalDateTime(
    value: string | null
  ): string {
    if (!value) {
      return '';
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return value.slice(0, 16);
    }

    const local =
      new Date(
        date.getTime()
        -
        date.getTimezoneOffset()
        *
        60_000
      );

    return local
      .toISOString()
      .slice(0, 16);
  }
}
