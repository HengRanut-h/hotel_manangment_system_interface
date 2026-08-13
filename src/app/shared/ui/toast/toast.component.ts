import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LucideCheckCircle2, LucideCircleAlert, LucideInfo, LucideX } from '@lucide/angular';
import { ToastService } from './toast.service';
@Component({
  selector: 'app-toast', standalone: true,
  imports: [LucideCheckCircle2, LucideCircleAlert, LucideInfo, LucideX],
  templateUrl: './toast.component.html', styleUrl: './toast.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastComponent { readonly toast = inject(ToastService); }
