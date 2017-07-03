import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { DatepickerModule } from 'angular2-material-datepicker';

@Component({
  selector: 'app-datepicker-material',
  templateUrl: './datepicker-material.component.html',
  styleUrls: ['./datepicker-material.component.css']
})
export class DatepickerMaterialComponent implements OnInit {
  date: Date;

  @Output('childData') outgoingData = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
    this.date = new Date();
    this.sendDate(this.date)
  }
  public sendDate(date: any) {
    this.outgoingData.emit(date);
    console.log(date)
  }
}
