import { inject, Injectable } from '@angular/core';
import { catchError, forkJoin, map, of } from 'rxjs';
import { ApiClientService } from '../../../core/http/api-client.service';
import { normalizePaged, PagedResult } from '../../../shared/models/paged-result.model';

export interface DashboardSummary { totalRooms:number; availableRooms:number; occupiedRooms:number; dirtyRooms:number; arrivalsToday:number; departuresToday:number; currentGuests:number; outstandingBalance:number; }
interface RevenueReport { total:number; count:number; byMethod:{method:string;amount:number;count:number}[]; }
interface OccupancyReport { occupancyRate:number; totalRooms:number; occupiedRooms:number; }
type Row=Record<string,unknown>;
export interface DashboardAnalytics {
 summary:DashboardSummary; months:string[]; monthlyRevenue:number[]; weeklyDays:string[]; occupancy:number[]; paymentMethods:{label:string;value:number}[]; roomStatus:{label:string;value:number}[]; reservationStatus:{label:string;value:number}[]; operationalStatus:{label:string;value:number}[]; inventoryAlerts:Row[]; recentReservations:Row[]; revenueTotal:number; reservationCount:number; invoiceOutstanding:number; staffCount:number;
}
@Injectable({providedIn:'root'})
export class DashboardAnalyticsService {
 private readonly api=inject(ApiClientService);
 load(){
  const now=new Date();
  const monthWindows=Array.from({length:12},(_,i)=>{const d=new Date(now.getFullYear(),i,1);const end=new Date(now.getFullYear(),i+1,0);return {label:d.toLocaleString('en-US',{month:'short'}),from:this.date(d),to:this.date(end)}});
  const occupancyDays=Array.from({length:7},(_,i)=>{const d=new Date(now);d.setDate(now.getDate()-6+i);return {label:d.toLocaleString('en-US',{weekday:'short'}),date:this.date(d)}});
  const revenue$=forkJoin(monthWindows.map(x=>this.api.get<RevenueReport>('reports/revenue',{from:x.from,to:x.to}).pipe(catchError(()=>of({total:0,count:0,byMethod:[]} as RevenueReport)))));
  const occupancy$=forkJoin(occupancyDays.map(x=>this.api.get<OccupancyReport>('reports/occupancy',{date:x.date}).pipe(catchError(()=>of({occupancyRate:0,totalRooms:0,occupiedRooms:0} as OccupancyReport)))));
  const list=(path:string)=>this.api.get<PagedResult<Row>|Row[]>(path,{pageNumber:1,pageSize:100}).pipe(map(normalizePaged),map(x=>x.items),catchError(()=>of([] as Row[])));
  return forkJoin({
   summary:this.api.get<DashboardSummary>('dashboard').pipe(catchError(()=>of({totalRooms:0,availableRooms:0,occupiedRooms:0,dirtyRooms:0,arrivalsToday:0,departuresToday:0,currentGuests:0,outstandingBalance:0}))), revenue:revenue$, occupancy:occupancy$, reservations:list('reservations'), payments:list('payments'), invoices:list('invoices'), housekeeping:list('housekeeping'), maintenance:list('maintenance'), inventory:list('inventory'), employees:list('employees')
  }).pipe(map(data=>{
   const paymentMethods=this.group(data.payments,'method','amount');
   const reservationStatus=this.group(data.reservations,'status');
   const operationalStatus=[...this.group(data.housekeeping,'status'),...this.group(data.maintenance,'status')].reduce<{label:string;value:number}[]>((acc,x)=>{const existing=acc.find(y=>y.label===x.label);if(existing)existing.value+=x.value;else acc.push({...x});return acc},[]);
   const roomStatus=[{label:'Available',value:data.summary.availableRooms},{label:'Occupied',value:data.summary.occupiedRooms},{label:'Dirty',value:data.summary.dirtyRooms},{label:'Other',value:Math.max(0,data.summary.totalRooms-data.summary.availableRooms-data.summary.occupiedRooms-data.summary.dirtyRooms)}];
   const inventoryAlerts=data.inventory.filter(x=>Number(x['quantity']??x['stockQuantity']??0)<=Number(x['reorderLevel']??0)).slice(0,6);
   const invoiceOutstanding=data.invoices.reduce((s,x)=>s+Math.max(0,Number(x['totalAmount']??0)-Number(x['paidAmount']??0)),0);
   return {summary:data.summary,months:monthWindows.map(x=>x.label),monthlyRevenue:data.revenue.map(x=>Number(x.total??0)),weeklyDays:occupancyDays.map(x=>x.label),occupancy:data.occupancy.map(x=>Number(x.occupancyRate??0)),paymentMethods,roomStatus,reservationStatus,operationalStatus,inventoryAlerts,recentReservations:data.reservations.slice(0,6),revenueTotal:data.revenue.reduce((s,x)=>s+Number(x.total??0),0),reservationCount:data.reservations.length,invoiceOutstanding:invoiceOutstanding||data.summary.outstandingBalance,staffCount:data.employees.length} as DashboardAnalytics;
  }));
 }
 private date(d:Date){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
 private group(rows:Row[],key:string,sumKey?:string){const m=new Map<string,number>();for(const row of rows){const label=String(row[key]??'Unknown');m.set(label,(m.get(label)??0)+(sumKey?Number(row[sumKey]??0):1))}return [...m].map(([label,value])=>({label,value})).sort((a,b)=>b.value-a.value).slice(0,6)}
}
