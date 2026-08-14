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

import {
  RoomOption
} from '../../models/room.model';

export interface RoomFormValue {
  branchId: string | null;
  roomTypeId: string;
  roomNumber: string;
  floor: number;
}

@Component({
  selector: 'app-room-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslationPipe
  ],
  templateUrl: './room-form.component.html',
  styleUrl: './room-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomFormComponent
  implements OnInit {

  readonly branchId =
    input<string | null>(
      null
    );

  readonly roomTypeId =
    input(
      ''
    );

  readonly roomNumber =
    input(
      ''
    );

  readonly floor =
    input(
      0
    );

  readonly branchOptions =
    input<RoomOption[]>(
      []
    );

  readonly roomTypeOptions =
    input<RoomOption[]>(
      []
    );

  readonly showBranch =
    input(
      false
    );

  readonly loadingOptions =
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
    output<RoomFormValue>();

  readonly cancelled =
    output<void>();

  readonly formBranchId =
    signal(
      ''
    );

  readonly formRoomTypeId =
    signal(
      ''
    );

  readonly formRoomNumber =
    signal(
      ''
    );

  readonly formFloor =
    signal(
      0
    );

  readonly touched =
    signal(
      false
    );

  ngOnInit(): void {

    this.formBranchId.set(
      this.branchId() ?? ''
    );

    this.formRoomTypeId.set(
      this.roomTypeId()
    );

    this.formRoomNumber.set(
      this.roomNumber()
    );

    this.formFloor.set(
      this.floor()
    );
  }

  submit(): void {

    this.touched.set(
      true
    );

    const roomNumber =
      this.formRoomNumber()
        .trim();

    const roomTypeId =
      this.formRoomTypeId();

    const floor =
      Number(
        this.formFloor()
      );

    if (
      !roomNumber
      ||
      !roomTypeId
      ||
      Number.isNaN(
        floor
      )
      ||
      floor < 0
      ||
      floor > 1000
      ||
      this.saving()
      ||
      this.loadingOptions()
    ) {
      return;
    }

    this.submitted.emit({
      branchId:
        this.formBranchId() || null,
      roomTypeId,
      roomNumber,
      floor
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

}
