import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent {//implements OnInit {
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [{
        stacked: true
      }]
    },
    animation: {
      duration: 0,
    },
    hover: {
      animationDuration: 0
    }
  };
  public barChartLabels: string[] = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;
  public barChartData: any[];

  @Input()
  weeklyTime: any;

  constructor() { }

  ngOnChanges() {
    this.barChartData = [
      { data: this.weeklyTime, label: 'Cases' },
    ];
  }

  // events
  public chartClicked(e: any): void {
    // this.selectedDay = e.active[0] ? e.active[0]._index : null;
    // if (this.selectedDay) {
    //   this.selectedDayCases = this.weeklyCases[this.selectedDay];
    // }
    console.log(e)
  }

  public chartHovered(e: any): void {
    console.log(e);
  }
}
