import {
  Founded,
  Present,
  CheckInData,
  AbsentData,
} from './../models/ResponseModel';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { StaffLeave } from '../staff/staff-leave/StaffLeave';
import { Leave } from './../admin/leavedays/Leave';
import { Staff } from './../models/Staff';
import { Salary } from '../admin/admin-salary/Salary';
import { Work } from '../staff/my-work/Work';
import {
  AllLeave,
  Approve,
  Delete,
  Insert,
  MailSend,
  Update,
} from '../models/ResponseModel';

@Injectable({
  providedIn: 'root',
})
export class StaffService {
  // url: string = 'http://localhost:3000/admin';
  // urlstaff: string = 'http://localhost:3000/staff';
  // url: string = 'http://192.168.0.172:5000/admin';
  // urlstaff: string = 'http://192.168.0.172:5000/staff';
  url: string = 'http://54.227.125.254:3000/admin';
  urlstaff: string = 'http://54.227.125.254:3000/staff';
  date: string;

  constructor(private http: HttpClient) {}

  setHeader() {
    const token = sessionStorage.getItem('authToken');

    return new HttpHeaders().set('Authorization', 'Bearer ' + token);
  }

  //admin

  updateAdminPassword(data: any): Observable<Update> {
    return this.http.post<Update>(this.url + '/update-password', data, {
      headers: this.setHeader(),
    });
  }

  getStaff(): Observable<Staff[]> {
    return this.http.get<Staff[]>(this.url + '/get-staff', {
      headers: this.setHeader(),
    });
  }

  getSpecificStaff(empid: string): Observable<Staff> {
    return this.http.get<Staff>(this.url + '/get-staff/' + empid, {
      headers: this.setStaffHeader(),
    });
  }

  getStaffUsingDname(dname: string): Observable<Staff[]> {
    return this.http.get<Staff[]>(this.url + `/get-staff-dname/${dname}`, {
      headers: this.setHeader(),
    });
  }

  addStaff(data: Staff): Observable<Insert> {
    return this.http.post<Insert>(this.url + '/add-staff', data, {
      headers: this.setHeader(),
    });
  }

  updateStaff(data: Staff): Observable<Update> {
    return this.http.patch<Update>(this.url + '/update-staff', data, {
      headers: this.setHeader(),
    });
  }

  deleteStaff(empid: string): Observable<Delete> {
    return this.http.delete<Delete>(this.url + '/delete-staff/' + empid, {
      headers: this.setHeader(),
    });
  }

  addLeave(data: Leave): Observable<Insert> {
    return this.http.post<Insert>(this.url + '/addleave', data, {
      headers: this.setHeader(),
    });
  }

  removeLeave(date: any): Observable<Delete> {
    return this.http.delete<Delete>(this.url + '/removeleave/' + date, {
      headers: this.setHeader(),
    });
  }

  getAllLeave(): Observable<AllLeave[]> {
    return this.http.get<AllLeave[]>(this.url + '/getall-leave');
  }

  getPendingLeave(): Observable<StaffLeave[]> {
    return this.http.get<StaffLeave[]>(this.url + '/getpending-staffleave', {
      headers: this.setHeader(),
    });
  }

  getApproveOrRejectLeave(): Observable<StaffLeave[]> {
    return this.http.get<StaffLeave[]>(
      this.url + '/getapproveorreject-staffleave',
      {
        headers: this.setHeader(),
      }
    );
  }

  approveLeave(data: any): Observable<Approve> {
    return this.http.patch<Approve>(this.url + '/approve-staffleave', data, {
      headers: this.setHeader(),
    });
  }

  rejectLeave(data: any): Observable<Approve> {
    return this.http.patch<Approve>(this.url + '/reject-staffleave', data, {
      headers: this.setHeader(),
    });
  }

  addSalary(data: Salary): Observable<Insert> {
    return this.http.post<Insert>(this.url + '/add-salary', data, {
      headers: this.setHeader(),
    });
  }

  getSalary(): Observable<Salary[]> {
    return this.http.get<Salary[]>(this.url + '/get-salary', {
      headers: this.setHeader(),
    });
  }

  deleteSalary(data: any): Observable<Delete> {
    return this.http.delete<Delete>(
      this.url + '/delete-salary/' + data.empid + '?' + data.salarydate,
      {
        headers: this.setHeader(),
      }
    );
  }

  sendMail(data: any): Observable<MailSend> {
    return this.http.post<MailSend>(this.url + '/send-mail', data, {
      headers: this.setHeader(),
    });
  }

  sendForgotPasswordMail(data: any): Observable<MailSend> {
    return this.http.post<MailSend>(
      this.url + '/send-forgot-password-mail',
      data
    );
  }

  getStaffWorkDetails(date: string): Observable<Work> {
    return this.http.get<Work>(this.url + '/get-staff-work/' + date, {
      headers: this.setHeader(),
    });
  }

  //regular staff

  loggednInData() {
    return JSON.parse(sessionStorage.getItem('loggedInData'));
  }

  checkedInData() {
    return JSON.parse(sessionStorage.getItem('checkInDetails'));
  }

  setStaffHeader() {
    const staffToken = sessionStorage.getItem('userAuthToken');

    return new HttpHeaders().set('Authorization', 'Bearer ' + staffToken);
  }

  getLeaveByDate(date: string): Observable<Founded> {
    return this.http.get<Founded>(
      this.urlstaff + '/get-leave-by-date?date=' + date,
      {
        headers: this.setStaffHeader(),
      }
    );
  }

  checkIn(data: any): Observable<Present> {
    return this.http.post<Present>(this.urlstaff + '/check-in', data, {
      headers: this.setStaffHeader(),
    });
  }

  checkOut(data: any): Observable<Present> {
    return this.http.patch<Present>(this.urlstaff + '/check-out', data, {
      headers: this.setStaffHeader(),
    });
  }

  checkInTableDetails(): Observable<CheckInData[]> {
    return this.http.get<CheckInData[]>(this.urlstaff + '/check-details', {
      headers: this.setStaffHeader(),
    });
  }

  applyLeave(data: StaffLeave): Observable<Approve> {
    return this.http.post<Approve>(this.urlstaff + '/apply-leave', data, {
      headers: this.setStaffHeader(),
    });
  }

  getAppliedLeave(empid: string): Observable<StaffLeave[]> {
    return this.http.get<StaffLeave[]>(
      this.urlstaff + '/get-applied-leave/' + empid,
      {
        headers: this.setStaffHeader(),
      }
    );
  }

  getApprovedLeave(empid: string): Observable<StaffLeave[]> {
    return this.http.get<StaffLeave[]>(
      this.urlstaff + '/get-approved-leave/' + empid,
      {
        headers: this.setStaffHeader(),
      }
    );
  }

  deleteAppliedLeave(empid: string, fromdate: string): Observable<Delete> {
    return this.http.delete<Delete>(
      this.urlstaff + '/delete-leave/' + empid + '?' + fromdate,
      {
        headers: this.setStaffHeader(),
      }
    );
  }

  updateProfile(data: Staff): Observable<Update> {
    return this.http.patch<Update>(this.url + '/update-staff', data, {
      headers: this.setStaffHeader(),
    });
  }

  getApprovedLeaveForAdmin(empid: string): Observable<StaffLeave[]> {
    return this.http.get<StaffLeave[]>(
      this.urlstaff + '/get-approved-leave/' + empid,
      {
        headers: this.setHeader(),
      }
    );
  }

  checkInTableDetailsForAdmin(): Observable<CheckInData[]> {
    return this.http.get<CheckInData[]>(this.urlstaff + '/check-details', {
      headers: this.setHeader(),
    });
  }

  getAbsentDataForAdmin(empid: string): Observable<AbsentData[]> {
    return this.http.get<AbsentData[]>(this.urlstaff + '/get-absent/' + empid, {
      headers: this.setHeader(),
    });
  }

  addAbsentData(data: any): Observable<Update> {
    return this.http.post<Update>(this.urlstaff + '/add-absent', data, {
      headers: this.setStaffHeader(),
    });
  }

  getAbsentData(empid: string): Observable<AbsentData[]> {
    return this.http.get<AbsentData[]>(this.urlstaff + '/get-absent/' + empid, {
      headers: this.setStaffHeader(),
    });
  }

  getSalaryForStaff(empid: string): Observable<Salary[]> {
    return this.http.get<Salary[]>(this.urlstaff + '/get-salary/' + empid, {
      headers: this.setStaffHeader(),
    });
  }

  addWorkDetails(data: Work): Observable<Insert> {
    return this.http.post<Insert>(this.urlstaff + '/add-work-detail', data, {
      headers: this.setStaffHeader(),
    });
  }

  getWorkDetails(empid: string): Observable<Work[]> {
    return this.http.get<Work[]>(this.urlstaff + '/get-work-detail/' + empid, {
      headers: this.setStaffHeader(),
    });
  }

  getWorkDetailsUsingDate(empid: string, date: any): Observable<Work[]> {
    return this.http.get<Work[]>(
      this.urlstaff + '/get-work-detail?empid=' + empid + '&date=' + date,
      {
        headers: this.setStaffHeader(),
      }
    );
  }
}
