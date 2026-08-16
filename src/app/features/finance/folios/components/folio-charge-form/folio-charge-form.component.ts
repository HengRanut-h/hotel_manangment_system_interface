import {
  ChangeDetectionStrategy,
  Component,
  output,
  signal
} from '@angular/core';

import {
  LucideCheckCircle2,
  LucideX
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  AddFolioChargeRequest
} from '../../models/folio.model';

@Component({
  selector:
    'app-folio-charge-form',

  standalone:
    true,

  imports: [
    TranslationPipe,
    LucideCheckCircle2,
    LucideX
  ],

  templateUrl:
    './folio-charge-form.component.html',

  styleUrl:
    './folio-charge-form.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class FolioChargeFormComponent {

  readonly submitted =
    output<AddFolioChargeRequest>();

  readonly cancelled =
    output<void>();

  readonly category =
    signal('');

  readonly description =
    signal('');

  readonly amountText =
    signal('');

  readonly touched =
    signal(false);


  setCategory(
    event: Event
  ): void {

    const target =
      event.target;

    if (
      target instanceof HTMLInputElement
    ) {
      this.category.set(
        target.value
      );
    }
  }


  setDescription(
    event: Event
  ): void {

    const target =
      event.target;

    if (
      target instanceof HTMLInputElement
    ) {
      this.description.set(
        target.value
      );
    }
  }


  setAmount(
    event: Event
  ): void {

    const target =
      event.target;

    if (
      target instanceof HTMLInputElement
    ) {
      this.amountText.set(
        target.value
      );
    }
  }


  valid(): boolean {

    const amount =
      Number(
        this.amountText()
      );

    return (
      this.category()
        .trim()
        .length
      >
      0

      &&

      this.description()
        .trim()
        .length
      >
      0

      &&

      Number.isFinite(amount)

      &&

      amount > 0
    );
  }


  submit(): void {

    this.touched.set(true);

    if (!this.valid()) {
      return;
    }

    this.submitted.emit({
      category:
        this.category()
          .trim(),

      description:
        this.description()
          .trim(),

      amount:
        Number(
          this.amountText()
        )
    });
  }


  cancel(): void {

    this.cancelled.emit();
  }
}
