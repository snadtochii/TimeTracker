import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { CasesService, AuthService } from '../../services';
import { DataToChart, Week } from '../../models';

@Component({
  selector: 'app-weekly-time-statistics',
  templateUrl: './weekly-time-statistics.component.html',
  styleUrls: ['./weekly-time-statistics.component.css']
})
export class WeeklyTimeStatisticsComponent implements OnInit {
  private week: Week;
  private isHours: boolean = true;
  private isLoading: boolean = false;
  private weeklyTime: any[];
  private weeklyTimeImagesQC: any[];
  private weeklyTimeCE: any[];
  private weeklyTimeQE: any[];
  private weeklyTimeOblCE: any[];
  private weeklyTimeOblQE: any[];
  private weekToChart: DataToChart;
  private totalWeeklyTime: number;
  private standardWeeklyTime: number;
  private weekDates: any;
  private readonly adminOverheadCoefficient: number = 0.9;

  datePick: Date;
  selectedDate: Date;

  constructor(private changeDetectorRef: ChangeDetectorRef, private casesService: CasesService, private authService: AuthService) {
  }

  ngOnInit() {
    this.datePick = new Date();
    this.onDateChange(this.datePick);
  }

  onDateChange(date) {
    this.selectedDate = new Date(date);
    this.getWeeklyTime(this.authService.getUser(), this.selectedDate);
  }

  getWeeklyTime(user, date): any {
    this.isLoading = true;

    this.weeklyTime = undefined;
    this.weeklyTimeImagesQC = undefined;
    this.weeklyTimeCE = undefined;
    this.weeklyTimeQE = undefined;
    this.weeklyTimeOblCE = undefined;
    this.weeklyTimeOblQE = undefined;
    this.weekDates = undefined;

    this.week = new Week();
    this.changeDetectorRef.detectChanges();
    this.casesService.getWeeklyTime(user, date).subscribe(res => {

      /// images
      this.week.weeklyTimeImagesQCMM = res.weekTime.weeklyTimeImagesQCMM ?
        res.weekTime.weeklyTimeImagesQCMM.map((el) => { return Math.round(el / this.adminOverheadCoefficient) }) : res.weekTime.weeklyTimeImagesQCMM;

      /// CE
      this.week.weeklyTimeCEMM = res.weekTime.weeklyTimeCEMM ?
        res.weekTime.weeklyTimeCEMM.map((el) => { return Math.round(el / this.adminOverheadCoefficient) }) : res.weekTime.weeklyTimeCEMM;

      /// Obl CE
      this.week.weeklyTimeOblCEMM = res.weekTime.weeklyTimeOblCEMM ?
        res.weekTime.weeklyTimeOblCEMM.map((el) => { return Math.round(el / this.adminOverheadCoefficient) }) : res.weekTime.weeklyTimeOblCEMM;

      /// QE
      this.week.weeklyTimeQEMM = res.weekTime.weeklyTimeQEMM ?
        res.weekTime.weeklyTimeQEMM.map((el) => { return Math.round(el / this.adminOverheadCoefficient) }) : res.weekTime.weeklyTimeQEMM;

      /// Obl QE
      this.week.weeklyTimeOblQEMM = res.weekTime.weeklyTimeOblQEMM ?
        res.weekTime.weeklyTimeOblQEMM.map((el) => { return Math.round(el / this.adminOverheadCoefficient) }) : res.weekTime.weeklyTimeOblQEMM;

      /// daily
      this.week.weeklyTimeMM = res.weekTime.weeklyTimeMM ?
        res.weekTime.weeklyTimeMM.map((el) => { return Math.round(el / this.adminOverheadCoefficient) }) : res.weekTime.weeklyTimeMM;

      /// total
      this.week.totalWeeklyTimeMM = Math.round(res.weekTime.totalWeeklyTimeMM / this.adminOverheadCoefficient);

      this.weekDates = this.casesService.getWeekDates(this.selectedDate);

      this.update();
      this.isLoading = false;
    });
  }

  update(): void {
    /// images
    this.week.weeklyTimeImagesQCMM && (this.weeklyTimeImagesQC = !this.isHours ? this.week.weeklyTimeImagesQCMM :
      this.week.weeklyTimeImagesQCMM.map((el) => +((el / this.week.minutesInHour).toFixed(1))));

    /// CE
    this.week.weeklyTimeCEMM && (this.weeklyTimeCE = !this.isHours ? this.week.weeklyTimeCEMM :
      this.week.weeklyTimeCEMM.map((el) => +((el / this.week.minutesInHour).toFixed(1))));

    /// Obl CE
    this.week.weeklyTimeOblCEMM && (this.weeklyTimeOblCE = !this.isHours ? this.week.weeklyTimeOblCEMM :
      this.week.weeklyTimeOblCEMM.map((el) => +((el / this.week.minutesInHour).toFixed(1))));

    /// QE
    this.week.weeklyTimeQEMM && (this.weeklyTimeQE = !this.isHours ? this.week.weeklyTimeQEMM :
      this.week.weeklyTimeQEMM.map((el) => +((el / this.week.minutesInHour).toFixed(1))));

    /// Obl QE
    this.week.weeklyTimeOblQEMM && (this.weeklyTimeOblQE = !this.isHours ? this.week.weeklyTimeOblQEMM :
      this.week.weeklyTimeOblQEMM.map((el) => +((el / this.week.minutesInHour).toFixed(1))));

    /// daily
    this.week.weeklyTimeMM && (this.weeklyTime = !this.isHours ? this.week.weeklyTimeMM :
      this.week.weeklyTimeMM.map((el) => +((el / this.week.minutesInHour).toFixed(1))));

    /// total
    this.totalWeeklyTime = !this.isHours ? this.week.totalWeeklyTimeMM :
      +((this.week.totalWeeklyTimeMM / this.week.minutesInHour).toFixed(1));

    /// time needed for week
    this.standardWeeklyTime = !this.isHours ? this.week.standardWeeklyTimeMM :
      +((this.week.standardWeeklyTimeMM / this.week.minutesInHour).toFixed(1));



    let data = [];
    this.weeklyTimeImagesQC && (data.push({ data: this.weeklyTimeImagesQC, label: 'Images' }));
    this.weeklyTimeCE && (data.push({ data: this.weeklyTimeCE, label: 'CE' }));
    this.weeklyTimeQE && (data.push({ data: this.weeklyTimeQE, label: 'QE' }));
    this.weeklyTimeOblCE && (data.push({ data: this.weeklyTimeOblCE, label: 'CE OBL' }));
    this.weeklyTimeOblQE && (data.push({ data: this.weeklyTimeOblQE, label: 'QE OBL' }));

    this.weekToChart = {
      data: data,
      date: this.weekDates,
      labels: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
    }
  }
}
