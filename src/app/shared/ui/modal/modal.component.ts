import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LucideX } from '@lucide/angular';
@Component({selector:'app-modal',standalone:true,imports:[LucideX],templateUrl:'./modal.component.html',styleUrl:'./modal.component.css',changeDetection:ChangeDetectionStrategy.OnPush})
export class ModalComponent { readonly open=input(false); readonly title=input('Dialog'); readonly wide=input(false); readonly closed=output<void>(); }
