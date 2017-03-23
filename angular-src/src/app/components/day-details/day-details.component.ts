import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-day-details',
  templateUrl: './day-details.component.html',
  styleUrls: ['./day-details.component.css']
})
export class DayDetailsComponent implements OnInit, OnChanges {

  @Input()
  dayCases: any;

  public casesToOutput: any[]
  public selectedDate: string;
  constructor() { }

  ngOnInit() { }
  
  ngOnChanges(changes: SimpleChanges) {
    this.casesToOutput = changes['dayCases'].currentValue.cases;
    this.selectedDate = changes['dayCases'].currentValue.selectedDate.toString().slice(0, 15);
  }


  filterByStep(e, step): void {
    console.log(e);
    console.log(step)
    e.preventDefault();
    this.casesToOutput = this.dayCases.cases.filter((val) => {
      return val.step.toLowerCase() === step.toLowerCase();
    })
    console.log(this.casesToOutput)
  }
}
