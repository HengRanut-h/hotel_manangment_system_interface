import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-spin',
  standalone: true,
  templateUrl: './spin.component.html',
  styleUrl: './spin.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpinComponent {
  readonly label = input('Loading...');
  readonly size = input<'small' | 'medium' | 'large'>('medium');
  readonly fullscreen = input(false);
  readonly inline = input(false);
}
