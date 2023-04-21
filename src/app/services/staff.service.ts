import { StaffLeave } from './../components/staff-leave/StaffLeave';
import { Leave } from './../admin/leavedays/Leave';

import { Observable } from 'rxjs';
import { Staff } from './../models/Staff';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Salary } from '../admin/admin-salary/Salary';

@Injectable({
  providedIn: 'root',
})
export class StaffService {
  url: string = 'http://localhost:5000/admin';
  urlstaff: string = 'http://localhost:5000/staff';
  // url: string = 'http://192.168.0.172:5000/admin';
  // urlstaff: string = 'http://192.168.0.172:5000/staff';
  date: string;

  constructor(private http: HttpClient) {}

  setHeader() {
    const token = sessionStorage.getItem('authToken');

    return new HttpHeaders().set('Authorization', 'Bearer ' + token);
  }

  //admin

  updateAdminPassword(data:any):Observable<any>{
    return this.http.post(this.url+'/update-password',data,{
      headers:this.setHeader()
    })
  }

  getStaff(): Observable<any> {
    return this.http.get(this.url + '/get-staff', {
      headers: this.setHeader(),
    });
  }

  getSpecificStaff(empid: string): Observable<any> {
    return this.http.get(this.url + '/get-staff/' + empid, {
      headers: this.setStaffHeader(),
    });
  }

  getStaffUsingDname(dname: string): Observable<any> {
    return this.http.get(this.url + `/get-staff-dname/${dname}`, {
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

  addSalary(data: Salary): Observable<any> {
    return this.http.post(this.url + '/add-salary', data, {
      headers: this.setHeader(),
    });
  }

  getSalary(): Observable<any> {
    return this.http.get(this.url + '/get-salary', {
      headers: this.setHeader(),
    });
  }

  sendMail(data: any): Observable<any> {
    return this.http.post(this.url + '/send-mail', data, {
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

  checkIn(data: any): Observable<any> {
    return this.http.post(this.urlstaff + '/check-in', data, {
      headers: this.setStaffHeader(),
    });
  }

  checkOut(data: any): Observable<any> {
    return this.http.patch(this.urlstaff + '/check-out', data, {
      headers: this.setStaffHeader(),
    });
  }

  checkInTableDetails(): Observable<any> {
    return this.http.get(this.urlstaff + '/check-details', {
      headers: this.setStaffHeader(),
    });
  }

  applyLeave(data: StaffLeave): Observable<any> {
    return this.http.post(this.urlstaff + '/apply-leave', data, {
      headers: this.setStaffHeader(),
    });
  }

  getAppliedLeave(empid: string): Observable<any> {
    return this.http.get(this.urlstaff + '/get-applied-leave/' + empid, {
      headers: this.setStaffHeader(),
    });
  }

  getApprovedLeave(empid: string): Observable<any> {
    return this.http.get(this.urlstaff + '/get-approved-leave/' + empid, {
      headers: this.setStaffHeader(),
    });
  }

  updateProfile(data: Staff): Observable<any> {
    return this.http.patch(this.url + '/update-staff', data, {
      headers: this.setStaffHeader(),
    });
  }

  getApprovedLeaveForAdmin(empid: string): Observable<any> {
    return this.http.get(this.urlstaff + '/get-approved-leave/' + empid, {
      headers: this.setHeader(),
    });
  }

  checkInTableDetailsForAdmin(): Observable<any> {
    return this.http.get(this.urlstaff + '/check-details', {
      headers: this.setHeader(),
    });
  }

  getAbsentDataForAdmin(empid: string): Observable<any> {
    return this.http.get(this.urlstaff + '/get-absent/' + empid, {
      headers: this.setHeader(),
    });
  }

  addAbsentData(data: any): Observable<any> {
    return this.http.post(this.urlstaff + '/add-absent', data, {
      headers: this.setStaffHeader(),
    });
  }

  getAbsentData(empid: string): Observable<any> {
    return this.http.get(this.urlstaff + '/get-absent/' + empid, {
      headers: this.setStaffHeader(),
    });
  }

  getSalaryForStaff(empid: string): Observable<any> {
    return this.http.get(this.urlstaff + '/get-salary/' + empid, {
      headers: this.setStaffHeader(),
    });
  }
}
