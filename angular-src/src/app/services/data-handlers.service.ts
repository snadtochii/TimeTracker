//TODO


import { Injectable } from '@angular/core';

@Injectable()
export class DataHandlersService {

  constructor() { }

  getMonthlyStatistics(cases: any[], options: any): any[] {
    let monthlyStatistics = (new Array(12)).fill(0);
    let monthlyFull: FullData[] = [];


    let temp = cases.filter((el) => {
      return (el.step.toLowerCase() === options.step.toLowerCase());
    })
      .filter((el) => {
        return options.caseTypes.some((type, i, arr) => {
          return /(\w+)$/.exec(type)[0].toLowerCase() === /(\w+)$/.exec(el.caseType)[0].toLowerCase();
        });
      });
    temp.forEach((el, i, arr) => {

      if (el.date && new Date(el.date) >= new Date(2017, 0)) {

        let ind = new Date(el.date).getMonth();
        if (!monthlyFull[ind]) {
          monthlyFull[ind] = new FullData();
        }
        monthlyFull[ind].fullTime += el.time;
        monthlyFull[ind].counter++;
      }
    });
    console.log(monthlyFull)
    monthlyStatistics = monthlyFull.map((el, i) => {
      if (!el) { return undefined; }
      return el.fullTime / el.counter;
    })
    console.log(monthlyStatistics)
    return monthlyStatistics;
  }
}
class FullData {
  fullTime: number;
  counter: number;
  constructor() {
    this.fullTime = 0;
    this.counter = 0;
  }
}