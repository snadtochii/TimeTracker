import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Injectable()
export class CasesService {

  constructor(private http: Http) { }
  getAllCases(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('https://10.20.24.60:3001/users/cases', {username: user.username}, { headers: headers })
      .map(res => res.json());
  }

  getCases(user) {
    let data = {
      username: JSON.parse(user).username
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('https://10.20.24.60:3001/users/cases', data, { headers: headers })
      .map(res => res.json());
  }

  getDailyCases(user, date = new Date()) {
    const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    let data = {
      username: JSON.parse(user).username,
      date: day,
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('https://10.20.24.60:3001/users/cases/details', data, { headers: headers })
      .map(res => res.json());
  }
  getWeeklyTime(user, date = new Date()) {
    let weekDates = this.getWeekDates(date);
    let data = {
      username: JSON.parse(user).username,
      startDate: weekDates.startDate,
      endDate: new Date(weekDates.endDate.getFullYear(), weekDates.endDate.getMonth(), weekDates.endDate.getDate() + 1)
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('https://10.20.24.60:3001/users/cases/weekly/time', data, { headers: headers })
      .map(res => res.json());
  }

  getWeekDates(date: Date) {
    const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayOfWeek = day.getDay();
    return {
      startDate: new Date(day.getFullYear(), day.getMonth(), day.getDate() - dayOfWeek),
      endDate: new Date(day.getFullYear(), day.getMonth(), day.getDate() + (6 - dayOfWeek))
    }
  }
}
