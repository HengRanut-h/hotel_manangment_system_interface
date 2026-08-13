import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { LucideChevronLeft, LucideChevronRight } from '@lucide/angular';
@Component({selector:'app-pager',standalone:true,imports:[LucideChevronLeft,LucideChevronRight],templateUrl:'./pager.component.html',styleUrl:'./pager.component.css',changeDetection:ChangeDetectionStrategy.OnPush})
export class PagerComponent {
  readonly page=input(1); readonly pageSize=input(20); readonly total=input(0); readonly pageChange=output<number>();
  readonly totalPages=computed(()=>Math.max(1,Math.ceil(this.total()/this.pageSize())));
  readonly from=computed(()=>this.total()===0?0:(this.page()-1)*this.pageSize()+1);
  readonly to=computed(()=>Math.min(this.total(),this.page()*this.pageSize()));
  prev(){if(this.page()>1)this.pageChange.emit(this.page()-1)} next(){if(this.page()<this.totalPages())this.pageChange.emit(this.page()+1)}
}
