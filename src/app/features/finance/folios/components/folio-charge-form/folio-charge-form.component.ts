import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  LucideReceiptText,
  LucidePlus,
  LucideX
} from '@lucide/angular';
import {
  AddFolioChargeRequest
} from '../../models/folio.model';

@Component({
  selector: 'app-folio-charge-form',
  standalone: true,
  imports: [
    FormsModule,
    LucideReceiptText,
    LucidePlus,
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
  readonly submitting =
    input(false);

  readonly submitted =
    output<AddFolioChargeRequest>();

  readonly cancelled =
    output<void>();

  readonly category =
    signal('');

  readonly description =
    signal('');

  readonly amount =
    signal<number | null>(null);

  readonly touched =
    signal(false);

  submit(): void {
    this.touched.set(true);

    const category =
      this.category().trim();

    const description =
      this.description().trim();

    const amount =
      Number(this.amount());

    if (
      !category ||
      !description ||
      this.amount() === null ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      this.submitting()
    ) {
      return;
    }

    this.submitted.emit({
      category,
      description,
      amount
    });
  }
}
