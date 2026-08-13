import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { LucideBedDouble, LucideCalendarCheck2, LucideCircleDollarSign, LucideDoorOpen, LucideRefreshCw, LucideSparkles, LucideTrendingUp, LucideUsers } from '@lucide/angular';
import { BarChartComponent } from '../../../../shared/charts/bar-chart/bar-chart.component';
import { DonutChartComponent } from '../../../../shared/charts/donut-chart/donut-chart.component';
import { LineChartComponent } from '../../../../shared/charts/line-chart/line-chart.component';
import { StatusBadgeComponent } from '../../../../shared/ui/status-badge/status-badge.component';
import { DashboardAnalytics, DashboardAnalyticsService } from '../../data-access/dashboard-analytics.service';
@Component({selector:'app-dashboard-page',standalone:true,imports:[CurrencyPipe,DecimalPipe,LucideBedDouble,LucideCalendarCheck2,LucideCircleDollarSign,LucideDoorOpen,LucideRefreshCw,LucideSparkles,LucideTrendingUp,LucideUsers,LineChartComponent,BarChartComponent,DonutChartComponent,StatusBadgeComponent],templateUrl:'./dashboard.page.html',styleUrl:'./dashboard.page.css',changeDetection:ChangeDetectionStrategy.OnPush})
export class DashboardPage implements OnInit {
 private readonly service=inject(DashboardAnalyticsService); readonly loading=signal(true); readonly data=signal<DashboardAnalytics|null>(null); readonly currentYear=new Date().getFullYear();
 readonly occupancyNow=computed(()=>{const s=this.data()?.summary;return s&&s.totalRooms?Math.round(s.occupiedRooms/s.totalRooms*100):0}); readonly revpar=computed(()=>{const d=this.data();return d&&d.summary.totalRooms?d.revenueTotal/d.summary.totalRooms/12:0}); readonly avgRevenue=computed(()=>this.data()?.monthlyRevenue.length?(this.data()!.revenueTotal/12):0);
 ngOnInit(){this.load()} load(){this.loading.set(true);this.service.load().subscribe({next:d=>{this.data.set(d);this.loading.set(false)},error:()=>this.loading.set(false)})}
 text(row:Record<string,unknown>,key:string){return String(row[key]??'—')}
}
