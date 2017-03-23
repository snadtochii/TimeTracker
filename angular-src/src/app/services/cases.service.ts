import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Injectable()
export class CasesService {

  constructor(private http: Http) { }
  getAllCases(username) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    //return this.http.post('https://10.20.24.60:3000/users/cases', username, { headers: headers })
        return this.http.post('https://localhost:3001/users/cases', username, { headers: headers })

      .map(res => res.json());
  }
  getWeeklyCases(user, date = new Date()) {
    const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayOfWeek = day.getDay();
    let data = {
      username: JSON.parse(user).username,
      startDate: new Date(day.getFullYear(), day.getMonth(), day.getDate() - dayOfWeek),
      endDate: new Date(day.getFullYear(), day.getMonth(), day.getDate() + (7 - dayOfWeek)),
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    //return this.http.post('https://10.20.24.60:3000/users/cases/weekly', data, { headers: headers })
        return this.http.post('https://localhost:3001/users/cases/weekly', data, { headers: headers })

      .map(res => res.json());
  }

}
