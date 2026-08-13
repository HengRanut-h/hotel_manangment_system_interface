import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
@Component({selector:'app-bar-chart',standalone:true,imports:[DecimalPipe],templateUrl:'./bar-chart.component.html',styleUrl:'./bar-chart.component.css',changeDetection:ChangeDetectionStrategy.OnPush})
export class BarChartComponent { readonly labels=input<string[]>([]); readonly values=input<number[]>([]); readonly color=input('#2b63e8'); readonly max=computed(()=>Math.max(1,...this.values())); height(v:number){return Math.max(4,(v/this.max())*100)} }
