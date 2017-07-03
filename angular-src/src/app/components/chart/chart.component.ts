import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent {
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [{
        stacked: true
      }]
    },
    animation: {
      duration: 1000
    },
    hover: {
      animationDuration: 300
    }
  };
  public barChartLabels: string[];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;
  public barChartData: any[];

  @Input()
  dataToChart: any;

  constructor() { }

  ngOnChanges() {
    this.barChartData = [];
    this.barChartLabels = [];

    console.log(this.dataToChart);
    this.dataToChart.data && (this.barChartData = this.dataToChart.data)
    this.dataToChart.labels && (this.barChartLabels = this.dataToChart.labels);
  }

  // events
  public chartClicked(e: any): void {
    console.log(e)
  }

  public chartHovered(e: any): void {
    console.log(e);
  }
}
