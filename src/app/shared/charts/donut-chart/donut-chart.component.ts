import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
export interface DonutSegment { label:string; value:number; color?:string; }
@Component({selector:'app-donut-chart',standalone:true,imports:[DecimalPipe],templateUrl:'./donut-chart.component.html',styleUrl:'./donut-chart.component.css',changeDetection:ChangeDetectionStrategy.OnPush})
export class DonutChartComponent {
 readonly segments=input<DonutSegment[]>([]); readonly centerLabel=input('Total'); readonly total=computed(()=>this.segments().reduce((sum,x)=>sum+x.value,0));
 readonly gradient=computed(()=>{const colors=['#16a36a','#2b63e8','#f59e0b','#8b5cf6','#e45757','#12a7b8'];let start=0;const t=this.total()||1;return `conic-gradient(${this.segments().map((s,i)=>{const end=start+(s.value/t)*100;const part=`${s.color??colors[i%colors.length]} ${start}% ${end}%`;start=end;return part}).join(',')})`});
 color(i:number){return this.segments()[i]?.color??['#16a36a','#2b63e8','#f59e0b','#8b5cf6','#e45757','#12a7b8'][i%6]}
 percent(v:number){return this.total()?Math.round(v/this.total()*100):0}
}
