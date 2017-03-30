import { Component, OnInit, Input } from '@angular/core';
import { CasesService } from '../../services/cases.service';
import { AuthService } from '../../services/auth.service';
import { Week } from '../../models/week';

@Component({
  selector: 'app-weekly-statistics',
  templateUrl: './weekly-statistics.component.html',
  styleUrls: ['./weekly-statistics.component.css']
})
export class WeeklyStatisticsComponent implements OnInit {
  private week: Week;
  private isHours: boolean = true;
  private showChart: boolean = false;

  private weeklyTime: any[];
  private weeklyTimeImagesQC: any[];
  private weeklyTimeCE: any[];
  private weeklyTimeQE: any[];

  private totalWeeklyTime: number;
  private standardWeeklyTime: number;

  private showImages: boolean = false;
  private showCE: boolean = false;
  private showQE: boolean = false;

  private selectedDay = null;
  private selectedDayCases = { cases: null, show: null, selectedDate: null };

  @Input()
  date: Date;

  onDateRes(date) {
    this.date = new Date(+date.year, +date.month - 1, +date.day);
    this.getWeeklyTime(this.authService.getUsername(), this.date);
  }
  constructor(private casesService: CasesService, private authService: AuthService) { }

  ngOnInit() {

  }
  getWeeklyTime(username, date): any {
    this.showImages = false;
    this.showCE = false;
    this.showQE = false;
    this.weeklyTime = null;

    this.week = new Week(this.date);

    let cases: any[];
    this.selectedDay = null;

    this.casesService.getWeeklyCases(username, date).subscribe(res => {
      cases = res.weekCases;
      cases.forEach((el) => {
        let ind = new Date(el.date).getDay();

        this.week.weeklyCases[ind].push(el);
        this.week.weeklyTimeMM[ind] += el.time;
        this.week.totalWeeklyTimeMM += el.time;

        if (el.role === 'ce') {
          this.showCE = true;
          this.week.weeklyCasesCE[ind].push(el);
          this.week.weeklyTimeCEMM[ind] += el.time;
        }
        if (el.role === 'qe') {
          if (el.step.toLowerCase() === 'images qc') {
            this.showImages = true;
            this.week.weeklyCasesImagesQC[ind].push(el);
            this.week.weeklyTimeImagesQCMM[ind] += el.time;
          } else {
            this.showQE = true;
            this.week.weeklyCasesQE[ind].push(el);
            this.week.weeklyTimeQEMM[ind] += el.time;
          }
        }
      });
      this.update();
    });
  }

  update(): void {
    this.weeklyTime = !this.isHours ? this.week.weeklyTimeMM
      : this.week.weeklyTimeMM.map((el) => +((el / 60).toFixed(1)));
    this.weeklyTimeImagesQC = !this.isHours ? this.week.weeklyTimeImagesQCMM :
      this.week.weeklyTimeImagesQCMM.map((el) => +((el / 60).toFixed(1)));;
    this.weeklyTimeCE = !this.isHours ? this.week.weeklyTimeCEMM :
      this.week.weeklyTimeCEMM.map((el) => +((el / 60).toFixed(1)));;
    this.weeklyTimeQE = !this.isHours ? this.week.weeklyTimeQEMM :
      this.week.weeklyTimeQEMM.map((el) => +((el / 60).toFixed(1)));;
    this.totalWeeklyTime = !this.isHours ? this.week.totalWeeklyTimeMM :
      +((this.week.totalWeeklyTimeMM / this.week.minutesInHour).toFixed(1));
    this.standardWeeklyTime = !this.isHours ? this.week.standardWeeklyTimeMM :
      +((this.week.standardWeeklyTimeMM / this.week.minutesInHour).toFixed(1));
  }
  // events
  public cellClicked(e: any, i: number, role: string): void {
    let actElement = document.querySelector('td.active');
    if (actElement){
      actElement.classList.remove('active');
    }
    e.target.classList.add('active');

    this.selectedDay = null;
    this.selectedDayCases = { cases: null, show: null, selectedDate: null };
    this.selectedDay = i;
    this.selectedDayCases.selectedDate = new Date(
      this.date.getFullYear(),
      this.date.getMonth(),
      this.date.getDate() - this.date.getDay() + this.selectedDay);
    if (this.selectedDay !== null) {
      if (role.toLowerCase() === 'all') {
        this.selectedDayCases.cases = this.week.weeklyCases[this.selectedDay];
        this.selectedDayCases.show = 'all';
      }
      if (role.toLowerCase() === 'images qc') {
        this.selectedDayCases.cases = this.week.weeklyCasesImagesQC[this.selectedDay];
        this.selectedDayCases.show = this.showImages;
        this.selectedDayCases.show = 'images qc';
      }
      if (role.toLowerCase() === 'ce') {
        this.selectedDayCases.cases = this.week.weeklyCasesCE[this.selectedDay];
        this.selectedDayCases.show = 'ce';
      }
      if (role.toLowerCase() === 'qe') {
        this.selectedDayCases.cases = this.week.weeklyCasesQE[this.selectedDay]
        this.selectedDayCases.show = 'qe';
      }
    }
  }
}
