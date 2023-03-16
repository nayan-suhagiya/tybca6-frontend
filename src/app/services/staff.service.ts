import dayGridPlugin from '@fullcalendar/daygrid';
import { CalendarOptions } from '@fullcalendar/core';
import * as moment from 'moment';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { Staff } from './../models/Staff';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StaffService {
  url: string = 'http://localhost:5000/admin';
  checkInDetails: any;
  date: string;
  calendarOptions: CalendarOptions;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  setHeader() {
    const token = this.cookieService.get('authToken');

    return new HttpHeaders().set('Authorization', 'Bearer ' + token);
  }

  //admin staff

  getStaff(): Observable<any> {
    return this.http.get(this.url + '/get-staff', {
      headers: this.setHeader(),
    });
  }

  addStaff(data: Staff): Observable<any> {
    return this.http.post(this.url + '/add-staff', data, {
      headers: this.setHeader(),
    });
  }

  updateStaff(data: Staff): Observable<any> {
    return this.http.patch(this.url + '/update-staff', data, {
      headers: this.setHeader(),
    });
  }

  deleteStaff(empid: string): Observable<any> {
    return this.http.delete(this.url + '/delete-staff/' + empid, {
      headers: this.setHeader(),
    });
  }

  //regular staff

  loggednInData() {
    return JSON.parse(this.cookieService.get('loggedInData'));
  }

  setStaffHeader() {
    const staffToken = this.cookieService.get('userAuthToken');

    return new HttpHeaders().set('Authorization', 'Bearer ' + staffToken);
  }

  checkIn(data: any): Observable<any> {
    return this.http.post('http://localhost:5000/staff/check-in', data, {
      headers: this.setStaffHeader(),
    });
  }

  isCheckedIn() {
    const isCheckedIn = this.cookieService.get('isCheckedIn');

    if (isCheckedIn == 'true') {
      return true;
    } else {
      return false;
    }
  }

  getDataOfCheckInStaff() {
    const checkInDetails = this.cookieService.get('checkInDetails');

    if (!checkInDetails) {
      this.calendarOptions = {
        initialView: 'dayGridMonth',
        plugins: [dayGridPlugin],
        events: [
          // { title: 'P', date: this.date, color: '#388007' },
          {
            title: 'A',
            date: moment(new Date()).format('YYYY-MM-DD'),
            color: '#dc3545',
          },
        ],
      };
    } else {
      this.checkInDetails = JSON.parse(checkInDetails);

      this.date = moment(this.checkInDetails.checkinDate).format('YYYY-MM-DD');

      if (this.checkInDetails.present) {
        this.calendarOptions = {
          initialView: 'dayGridMonth',
          plugins: [dayGridPlugin],
          events: [
            { title: 'P', date: this.date, color: '#388007' },
            // { title: 'A', date: '2023-03-17', color: '#dc3545' },
          ],
        };
        return;
      }
      // } else {
      //   this.calendarOptions = {
      //     initialView: 'dayGridMonth',
      //     plugins: [dayGridPlugin],
      //     events: [
      //       // { title: 'P', date: this.date, color: '#388007' },
      //       { title: 'A', date: this.date, color: '#dc3545' },
      //     ],
      //   };
      // }
    }
  }
}
