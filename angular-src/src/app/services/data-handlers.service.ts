//TODO


import { Injectable } from '@angular/core';

@Injectable()
export class DataHandlersService {

  constructor() { }

  getMonthlyStatistics(cases: any[], step: string): any[] {
    let monthlyStatistics = (new Array(12)).fill(0);
    let monthlyFull: any = {
      fullTime: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      counter: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    };
    console.log(monthlyFull)

    let temp = cases.filter((el) => {
      return el.step.toLowerCase() === step.toLowerCase();
    });
    temp.forEach((el, i, arr) => {

      if (el.date && new Date(el.date) >= new Date(2017, 0)) {

        let ind = new Date(el.date).getMonth();

        monthlyFull.fullTime[ind] += el.time;
        monthlyFull.counter[ind]++;
      }
    });

    monthlyStatistics = monthlyFull.fullTime.map((el, i) => {
      return el / monthlyFull.counter[i];
    })
    return monthlyStatistics;
  }
}