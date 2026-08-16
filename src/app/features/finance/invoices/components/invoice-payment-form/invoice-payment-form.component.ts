
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  input,
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
  RecordInvoicePaymentRequest
} from '../../models/invoice.model';

@Component({
  selector: 'app-invoice-payment-form',
  standalone: true,
  imports: [
    TranslationPipe,
    LucideCheckCircle2,
    LucideX
  ],
  templateUrl: './invoice-payment-form.component.html',
  styleUrl: './invoice-payment-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoicePaymentFormComponent
  implements OnInit {

  readonly suggestedAmount = input(0);

  readonly submitted =
    output<RecordInvoicePaymentRequest>();

  readonly cancelled = output<void>();

  readonly amount = signal('');
  readonly method = signal('');
  readonly referenceNumber = signal('');
  readonly touched = signal(false);

  ngOnInit(): void {
    if (this.suggestedAmount() > 0) {
      this.amount.set(
        this.suggestedAmount().toFixed(2)
      );
    }
  }

  setAmount(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      this.amount.set(target.value);
    }
  }

  setMethod(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      this.method.set(target.value);
    }
  }

  setReference(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      this.referenceNumber.set(target.value);
    }
  }

  valid(): boolean {
    const amount = Number(this.amount());

    return (
      Number.isFinite(amount) &&
      amount > 0 &&
      this.method().trim().length > 0
    );
  }

  submit(): void {
    this.touched.set(true);

    if (!this.valid()) {
      return;
    }

    const reference =
      this.referenceNumber().trim();

    this.submitted.emit({
      amount: Number(this.amount()),
      method: this.method().trim(),
      referenceNumber:
        reference ? reference : null
    });
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
