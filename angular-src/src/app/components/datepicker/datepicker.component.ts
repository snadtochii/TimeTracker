import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DatePickerOptions, DateModel } from 'ng2-datepicker';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css']
})
export class DatepickerComponent implements OnInit {
  public date: DateModel;
  options: DatePickerOptions;

 @Output('childData') outgoingData = new EventEmitter<string>();

  constructor() { 
    this.options = new DatePickerOptions({initialDate:new Date()});
  }
  ngOnInit() {
    this.date = new DateModel();
  }
	public sendDate(date:any){
		this.outgoingData.emit(date);
	}
}
