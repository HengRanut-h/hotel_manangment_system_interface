import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  LucideFilePlus2,
  LucideSave,
  LucideX
} from '@lucide/angular';
import {
  CreateFolioRequest
} from '../../models/folio.model';

@Component({
  selector: 'app-folio-create-form',
  standalone: true,
  imports: [
    FormsModule,
    LucideFilePlus2,
    LucideSave,
    LucideX
  ],
  templateUrl:
    './folio-create-form.component.html',
  styleUrl:
    './folio-create-form.component.css',
  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class FolioCreateFormComponent {
  readonly submitting =
    input(false);

  readonly submitted =
    output<CreateFolioRequest>();

  readonly cancelled =
    output<void>();

  readonly reservationId =
    signal('');

  readonly guestId =
    signal('');

  readonly touched =
    signal(false);

  submit(): void {
    this.touched.set(true);

    const reservationId =
      this.reservationId().trim();

    const guestId =
      this.guestId().trim();

    if (
      !reservationId ||
      !guestId ||
      this.submitting()
    ) {
      return;
    }

    this.submitted.emit({
      reservationId,
      guestId
    });
  }
}
