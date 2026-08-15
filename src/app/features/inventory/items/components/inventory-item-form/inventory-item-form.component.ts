import {
  ChangeDetectionStrategy,
  Component,
  output,
  signal
} from '@angular/core';

import {
  LucideCheck,
  LucidePackagePlus
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  CreateInventoryItemRequest
} from '../../models/inventory-item.model';

@Component({
  selector:
    'app-inventory-item-form',

  standalone:
    true,

  imports: [
    TranslationPipe,
    LucideCheck,
    LucidePackagePlus
  ],

  templateUrl:
    './inventory-item-form.component.html',

  styleUrl:
    './inventory-item-form.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class InventoryItemFormComponent {

  readonly submitted =
    output<CreateInventoryItemRequest>();

  readonly cancelled =
    output<void>();

  readonly sku =
    signal('');

  readonly name =
    signal('');

  readonly unit =
    signal('');

  readonly quantityOnHand =
    signal('0');

  readonly reorderLevel =
    signal('0');

  readonly touched =
    signal(false);

  setSku(
    event: Event
  ): void {

    const target =
      event.target;

    if (
      !(target instanceof HTMLInputElement)
    ) {
      return;
    }

    this.sku.set(
      target.value
        .toUpperCase()
    );
  }

  setName(
    event: Event
  ): void {

    const target =
      event.target;

    if (
      !(target instanceof HTMLInputElement)
    ) {
      return;
    }

    this.name.set(
      target.value
    );
  }

  setUnit(
    event: Event
  ): void {

    const target =
      event.target;

    if (
      !(target instanceof HTMLInputElement)
    ) {
      return;
    }

    this.unit.set(
      target.value
    );
  }

  setQuantity(
    event: Event
  ): void {

    const target =
      event.target;

    if (
      !(target instanceof HTMLInputElement)
    ) {
      return;
    }

    this.quantityOnHand.set(
      target.value
    );
  }

  setReorderLevel(
    event: Event
  ): void {

    const target =
      event.target;

    if (
      !(target instanceof HTMLInputElement)
    ) {
      return;
    }

    this.reorderLevel.set(
      target.value
    );
  }

  submit(): void {

    this.touched.set(
      true
    );

    const sku =
      this.sku()
        .trim()
        .toUpperCase();

    const name =
      this.name()
        .trim();

    const unit =
      this.unit()
        .trim();

    const quantityOnHand =
      Number(
        this.quantityOnHand()
      );

    const reorderLevel =
      Number(
        this.reorderLevel()
      );

    if (
      !sku
      ||
      !name
      ||
      !unit
      ||
      !Number.isFinite(
        quantityOnHand
      )
      ||
      quantityOnHand < 0
      ||
      !Number.isFinite(
        reorderLevel
      )
      ||
      reorderLevel < 0
    ) {
      return;
    }

    this.submitted.emit({
      sku,
      name,
      unit,
      quantityOnHand,
      reorderLevel
    });
  }

  cancel(): void {

    this.cancelled.emit();
  }

  isInvalid(): boolean {

    if (!this.touched()) {
      return false;
    }

    const quantity =
      Number(
        this.quantityOnHand()
      );

    const reorder =
      Number(
        this.reorderLevel()
      );

    return (
      !this.sku()
        .trim()
      ||
      !this.name()
        .trim()
      ||
      !this.unit()
        .trim()
      ||
      !Number.isFinite(
        quantity
      )
      ||
      quantity < 0
      ||
      !Number.isFinite(
        reorder
      )
      ||
      reorder < 0
    );
  }
}
