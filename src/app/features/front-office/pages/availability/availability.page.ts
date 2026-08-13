import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideBedDouble, LucideCalendarSearch, LucideSearch } from '@lucide/angular';
import { ApiClientService } from '../../../../core/http/api-client.service';
import { StatusBadgeComponent } from '../../../../shared/ui/status-badge/status-badge.component';
interface AvailableRoom{id:string;roomNumber:string;roomTypeId:string;roomTypeName:string;baseRate:number;status:string}
@Component({selector:'app-availability-page',standalone:true,imports:[CurrencyPipe,FormsModule,LucideBedDouble,LucideCalendarSearch,LucideSearch,StatusBadgeComponent],templateUrl:'./availability.page.html',styleUrl:'./availability.page.css',changeDetection:ChangeDetectionStrategy.OnPush})
export class AvailabilityPage {private readonly api=inject(ApiClientService);readonly checkIn=signal(this.date(0));readonly checkOut=signal(this.date(1));readonly rooms=signal<AvailableRoom[]>([]);readonly loading=signal(false);set(e:Event,target:'in'|'out'){const v=(e.target as HTMLInputElement).value;target==='in'?this.checkIn.set(v):this.checkOut.set(v)}search(){this.loading.set(true);this.api.get<AvailableRoom[]>('availability',{checkIn:this.checkIn(),checkOut:this.checkOut()}).subscribe({next:r=>{this.rooms.set(r);this.loading.set(false)},error:()=>this.loading.set(false)})}private date(add:number){const d=new Date();d.setDate(d.getDate()+add);return d.toISOString().slice(0,10)}}
