import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
export interface ChartSeries { name:string; values:number[]; color?:string; }
@Component({selector:'app-line-chart',standalone:true,templateUrl:'./line-chart.component.html',styleUrl:'./line-chart.component.css',changeDetection:ChangeDetectionStrategy.OnPush})
export class LineChartComponent {
  readonly labels=input<string[]>([]); readonly series=input<ChartSeries[]>([]); readonly height=input(250);
  readonly max=computed(()=>Math.max(1,...this.series().flatMap(s=>s.values)));
  readonly guides=computed(()=>[1,.75,.5,.25,0].map(x=>({y:20+(1-x)*160,label:this.format(this.max()*x)})));
  points(values:number[]):string{const count=Math.max(2,values.length);return values.map((v,i)=>`${20+(i/(count-1))*560},${180-(v/this.max())*150}`).join(' ')}
  area(values:number[]):string{return `20,180 ${this.points(values)} 580,180`}
  color(index:number):string{return this.series()[index]?.color ?? ['#2b63e8','#16a36a','#f59e0b','#8b5cf6'][index%4]}
  private format(value:number):string{if(value>=1000000)return `$${(value/1000000).toFixed(1)}M`;if(value>=1000)return `$${(value/1000).toFixed(0)}K`;return Math.round(value).toString()}
}
