import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  output,
  signal
} from '@angular/core';

import {
  LucideSave,
  LucideUserRound
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  Guest,
  GuestRequest
} from '../../models/guest.model';

@Component({
  selector: 'app-guest-form',
  standalone: true,
  imports: [
    TranslationPipe,
    LucideSave,
    LucideUserRound
  ],
  templateUrl: './guest-form.component.html',
  styleUrl: './guest-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GuestFormComponent
  implements OnInit {

  readonly initialValue =
    input<Guest | null>(null);

  readonly submitting =
    input(false);

  readonly submitLabelKey =
    input('guests.saveGuest');

  readonly submitted =
    output<GuestRequest>();

  readonly firstName =
    signal('');

  readonly lastName =
    signal('');

  readonly phone =
    signal('');

  readonly email =
    signal('');

  readonly isVip =
    signal(false);

  readonly touched =
    signal(false);

  readonly errorKey =
    signal('');

  ngOnInit(): void {
    const guest =
      this.initialValue();

    if (!guest) {
      return;
    }

    this.firstName.set(
      guest.firstName
    );

    this.lastName.set(
      guest.lastName
    );

    this.phone.set(
      guest.phone ?? ''
    );

    this.email.set(
      guest.email ?? ''
    );

    this.isVip.set(
      guest.isVip
    );
  }

  setFirstName(event: Event): void {
    const target = event.target;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    this.firstName.set(target.value);
    this.errorKey.set('');
  }

  setLastName(event: Event): void {
    const target = event.target;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    this.lastName.set(target.value);
    this.errorKey.set('');
  }

  setPhone(event: Event): void {
    const target = event.target;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    this.phone.set(target.value);
  }

  setEmail(event: Event): void {
    const target = event.target;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    this.email.set(target.value);
    this.errorKey.set('');
  }

  setVip(event: Event): void {
    const target = event.target;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    this.isVip.set(target.checked);
  }

  submit(): void {
    this.touched.set(true);

    if (this.submitting()) {
      return;
    }

    const firstName =
      this.firstName().trim();

    const lastName =
      this.lastName().trim();

    const phone =
      this.normalizeOptional(
        this.phone()
      );

    const email =
      this.normalizeOptional(
        this.email()
      );

    if (!firstName || !lastName) {
      this.errorKey.set(
        'guests.nameRequired'
      );

      return;
    }

    if (
      email &&
      !this.isEmail(email)
    ) {
      this.errorKey.set(
        'guests.invalidEmail'
      );

      return;
    }

    this.errorKey.set('');

    this.submitted.emit({
      firstName,
      lastName,
      phone,
      email,
      isVip:
        this.isVip()
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

  private isEmail(
    value: string
  ): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      .test(value);
  }
}
