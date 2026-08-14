import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  output,
  signal
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

export interface AttendanceFormValue {
  title: string;
  notes: string | null;
  amount: number;
  eventAtUtc: string;
  branchId: string | null;
  relatedEntityId: string | null;
  relatedEntityType: string | null;
  status: string;
}

@Component({
  selector: 'app-attendance-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslationPipe
  ],
  templateUrl: './attendance-form.component.html',
  styleUrl: './attendance-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttendanceFormComponent
  implements OnInit {

  readonly title =
    input(
      ''
    );

  readonly notes =
    input<string | null>(
      null
    );

  readonly amount =
    input(
      0
    );

  readonly eventAtUtc =
    input(
      ''
    );

  readonly branchId =
    input<string | null>(
      null
    );

  readonly relatedEntityId =
    input<string | null>(
      null
    );

  readonly relatedEntityType =
    input<string | null>(
      null
    );

  readonly status =
    input(
      'Open'
    );

  readonly showBranch =
    input(
      false
    );

  readonly showStatus =
    input(
      false
    );

  readonly saving =
    input(
      false
    );

  readonly submitLabel =
    input(
      ''
    );

  readonly submitted =
    output<AttendanceFormValue>();

  readonly cancelled =
    output<void>();

  readonly formTitle =
    signal(
      ''
    );

  readonly formNotes =
    signal(
      ''
    );

  readonly formAmount =
    signal(
      0
    );

  readonly formEventAt =
    signal(
      ''
    );

  readonly formBranchId =
    signal(
      ''
    );

  readonly formRelatedEntityId =
    signal(
      ''
    );

  readonly formRelatedEntityType =
    signal(
      ''
    );

  readonly formStatus =
    signal(
      'Open'
    );

  readonly touched =
    signal(
      false
    );

  ngOnInit(): void {

    this.formTitle.set(
      this.title()
    );

    this.formNotes.set(
      this.notes() ?? ''
    );

    this.formAmount.set(
      this.amount()
    );

    this.formEventAt.set(
      this.toDateTimeLocal(
        this.eventAtUtc()
      )
    );

    this.formBranchId.set(
      this.branchId() ?? ''
    );

    this.formRelatedEntityId.set(
      this.relatedEntityId() ?? ''
    );

    this.formRelatedEntityType.set(
      this.relatedEntityType() ?? ''
    );

    this.formStatus.set(
      this.status() || 'Open'
    );
  }

  submit(): void {

    this.touched.set(
      true
    );

    const title =
      this.formTitle()
        .trim();

    const eventAtUtc =
      this.toDateTimeOffset(
        this.formEventAt()
      );

    if (
      !title
      ||
      !eventAtUtc
      ||
      this.saving()
    ) {
      return;
    }

    this.submitted.emit({
      title,
      notes:
        this.formNotes()
          .trim()
        || null,
      amount:
        Number(
          this.formAmount()
        ) || 0,
      eventAtUtc,
      branchId:
        this.formBranchId()
          .trim()
        || null,
      relatedEntityId:
        this.formRelatedEntityId()
          .trim()
        || null,
      relatedEntityType:
        this.formRelatedEntityType()
          .trim()
        || null,
      status:
        this.formStatus()
          .trim()
        || 'Open'
    });
  }

  cancel(): void {

    if (
      this.saving()
    ) {
      return;
    }

    this.cancelled.emit();
  }

  private toDateTimeLocal(
    value: string
  ): string {

    if (!value) {
      return '';
    }

    const date =
      new Date(
        value
      );

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return '';
    }

    const offset =
      date.getTimezoneOffset();

    const local =
      new Date(
        date.getTime() -
        offset * 60_000
      );

    return local
      .toISOString()
      .slice(
        0,
        16
      );
  }

  private toDateTimeOffset(
    value: string
  ): string {

    if (!value) {
      return '';
    }

    const date =
      new Date(
        value
      );

    return Number.isNaN(
      date.getTime()
    )
      ? ''
      : date.toISOString();
  }

}
