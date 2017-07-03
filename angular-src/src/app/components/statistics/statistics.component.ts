 /// just a sample, needs to be completed



import { Component, OnInit } from '@angular/core';

import { CasesService, AuthService, DataHandlersService } from '../../services';
import { DataToChart } from '../../models';
@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit { 

  datePick: Date;
  private dataToChart: DataToChart;
  private isLoading: boolean = false;

  constructor(private casesService: CasesService, private authService: AuthService, private dataHandlersService: DataHandlersService) { }

  ngOnInit() {
    this.datePick = new Date();
    this.onDateChange(this.datePick)
  }

  onDateChange(date: Date) {
    this.isLoading = true;
    this.dataToChart = undefined;
    console.log(JSON.parse(this.authService.getUser()))
    this.casesService.getCases(this.authService.getUser()).subscribe((res) => {
      let data = this.dataHandlersService.getMonthlyStatistics(res.cases, 'pre-planning').map((el)=>{
        if(isNaN(el)){
          el = 0;
        } else{
          el = Math.round(el)
        }
        return el;
      })
      this.dataToChart = {
        data: [{data: data, label: 'Pre-Planning'}],
        date: null,
        labels: ['1', '2', '3','4', '5', '6','7', '8', '9','10', '11', '12']
      }
    })

    this.isLoading = false;
  }
}
