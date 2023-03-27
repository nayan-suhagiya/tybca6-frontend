import { StaffLeave } from './../components/staff-leave/StaffLeave';
import { Leave } from './../admin/leavedays/Leave';
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

  addLeave(data: Leave): Observable<any> {
    return this.http.post(this.url + '/addleave', data, {
      headers: this.setHeader(),
    });
  }

  removeLeave(date: any): Observable<any> {
    return this.http.delete(this.url + '/removeleave/' + date, {
      headers: this.setHeader(),
    });
  }

  getAllLeave(): Observable<any> {
    return this.http.get(this.url + '/getall-leave');
  }

  getPendingLeave(): Observable<any> {
    return this.http.get(this.url + '/getpending-staffleave', {
      headers: this.setHeader(),
    });
  }

  getApproveOrRejectLeave(): Observable<any> {
    return this.http.get(this.url + '/getapproveorreject-staffleave', {
      headers: this.setHeader(),
    });
  }

  approveLeave(data: any): Observable<any> {
    return this.http.patch(this.url + '/approve-staffleave', data, {
      headers: this.setHeader(),
    });
  }

  rejectLeave(data: any): Observable<any> {
    return this.http.patch(this.url + '/reject-staffleave', data, {
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

  checkOut(data: any): Observable<any> {
    return this.http.patch('http://localhost:5000/staff/check-out', data, {
      headers: this.setStaffHeader(),
    });
  }

  checkInTableDetails(): Observable<any> {
    return this.http.get('http://localhost:5000/staff/check-details', {
      headers: this.setStaffHeader(),
    });
  }

  applyLeave(data: StaffLeave): Observable<any> {
    return this.http.post('http://localhost:5000/staff/apply-leave', data, {
      headers: this.setStaffHeader(),
    });
  }

  getAppliedLeave(empid: string): Observable<any> {
    return this.http.get(
      'http://localhost:5000/staff/get-applied-leave/' + empid,
      { headers: this.setStaffHeader() }
    );
  }
}
