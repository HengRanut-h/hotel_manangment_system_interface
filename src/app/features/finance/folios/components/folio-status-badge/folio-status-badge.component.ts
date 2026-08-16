import {
  ChangeDetectionStrategy,
  Component,
  input
} from '@angular/core';
import {
  LucideBookOpen,
  LucideCircleCheck
} from '@lucide/angular';

@Component({
  selector: 'app-folio-status-badge',
  standalone: true,
  imports: [
    LucideBookOpen,
    LucideCircleCheck
  ],
  templateUrl:
    './folio-status-badge.component.html',
  styleUrl:
    './folio-status-badge.component.css',
  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class FolioStatusBadgeComponent {
  readonly closed =
    input<boolean | null | undefined>();
}
