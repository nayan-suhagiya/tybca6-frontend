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
import { environment } from 'src/environments/environment.prod';
import { CONSTANT } from '../constant/constant';

@Injectable({
  providedIn: 'root',
})
export class StaffService {
  url: string = environment.ADMIN_API_ENDPOINT;
  urlstaff: string = environment.STAFF_API_ENDPOINT;
  date: string;

  constructor(private http: HttpClient) {}

  setHeader() {
    const token = sessionStorage.getItem('authToken');

    return new HttpHeaders().set('Authorization', 'Bearer ' + token);
  }

  //admin

  updateAdminPassword(data: any): Observable<Update> {
    return this.http.post<Update>(
      this.url + CONSTANT.ENDPOINTS.UPDATE_PASSWORD,
      data,
      {
        headers: this.setHeader(),
      }
    );
  }

  getStaff(): Observable<Staff[]> {
    return this.http.get<Staff[]>(this.url + CONSTANT.ENDPOINTS.GET_STAFF, {
      headers: this.setHeader(),
    });
  }

  getSpecificStaff(empid: string): Observable<Staff> {
    return this.http.get<Staff>(
      this.url + CONSTANT.ENDPOINTS.GET_STAFF + empid,
      {
        headers: this.setStaffHeader(),
      }
    );
  }

  getStaffUsingDname(dname: string): Observable<Staff[]> {
    return this.http.get<Staff[]>(
      this.url + CONSTANT.ENDPOINTS.GET_STAFF_USING_DEPARTMENT + dname,
      {
        headers: this.setHeader(),
      }
    );
  }

  addStaff(data: Staff): Observable<Insert> {
    return this.http.post<Insert>(
      this.url + CONSTANT.ENDPOINTS.ADD_STAFF,
      data,
      {
        headers: this.setHeader(),
      }
    );
  }

  updateStaff(data: Staff): Observable<Update> {
    return this.http.patch<Update>(
      this.url + CONSTANT.ENDPOINTS.UPDATE_STAFF,
      data,
      {
        headers: this.setHeader(),
      }
    );
  }

  deleteStaff(empid: string): Observable<Delete> {
    return this.http.delete<Delete>(
      this.url + CONSTANT.ENDPOINTS.DELETE_STAFF + empid,
      {
        headers: this.setHeader(),
      }
    );
  }

  addLeave(data: Leave): Observable<Insert> {
    return this.http.post<Insert>(
      this.url + CONSTANT.ENDPOINTS.ADD_LEAVE,
      data,
      {
        headers: this.setHeader(),
      }
    );
  }

  removeLeave(date: any): Observable<Delete> {
    return this.http.delete<Delete>(
      this.url + CONSTANT.ENDPOINTS.REMOVE_LEAVE + date,
      {
        headers: this.setHeader(),
      }
    );
  }

  getAllLeave(): Observable<AllLeave[]> {
    return this.http.get<AllLeave[]>(
      this.url + CONSTANT.ENDPOINTS.GET_ALL_LEAVE
    );
  }

  getPendingLeave(): Observable<StaffLeave[]> {
    return this.http.get<StaffLeave[]>(
      this.url + CONSTANT.ENDPOINTS.GET_PENDING_STAFF_LEAVE,
      {
        headers: this.setHeader(),
      }
    );
  }

  getApproveOrRejectLeave(): Observable<StaffLeave[]> {
    return this.http.get<StaffLeave[]>(
      this.url + CONSTANT.ENDPOINTS.GET_APPROVED_OR_REJECT_STAFF_LEAVE,
      {
        headers: this.setHeader(),
      }
    );
  }

  approveLeave(data: any): Observable<Approve> {
    return this.http.patch<Approve>(
      this.url + CONSTANT.ENDPOINTS.APPROVE_STAFF_LEAVE,
      data,
      {
        headers: this.setHeader(),
      }
    );
  }

  rejectLeave(data: any): Observable<Approve> {
    return this.http.patch<Approve>(
      this.url + CONSTANT.ENDPOINTS.REJECT_STAFF_LEAVE,
      data,
      {
        headers: this.setHeader(),
      }
    );
  }

  addSalary(data: Salary): Observable<Insert> {
    return this.http.post<Insert>(
      this.url + CONSTANT.ENDPOINTS.ADD_SALARY,
      data,
      {
        headers: this.setHeader(),
      }
    );
  }

  getSalary(): Observable<Salary[]> {
    return this.http.get<Salary[]>(this.url + CONSTANT.ENDPOINTS.GET_SALARY, {
      headers: this.setHeader(),
    });
  }

  deleteSalary(data: any): Observable<Delete> {
    return this.http.delete<Delete>(
      this.url +
        CONSTANT.ENDPOINTS.DELETE_SALARY +
        data.empid +
        '?' +
        data.salarydate,
      {
        headers: this.setHeader(),
      }
    );
  }

  sendMail(data: any): Observable<MailSend> {
    return this.http.post<MailSend>(
      this.url + CONSTANT.ENDPOINTS.SEND_MAIL,
      data,
      {
        headers: this.setHeader(),
      }
    );
  }

  sendForgotPasswordMail(data: any): Observable<MailSend> {
    return this.http.post<MailSend>(
      this.url + CONSTANT.ENDPOINTS.SEND_FORGOT_PASSWORD_MAIL,
      data
    );
  }

  getStaffWorkDetails(date: string): Observable<Work> {
    return this.http.get<Work>(
      this.url + CONSTANT.ENDPOINTS.GET_STAFF_WORK + date,
      {
        headers: this.setHeader(),
      }
    );
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
      this.urlstaff + CONSTANT.ENDPOINTS.GET_LEAVE_BY_DATE + date,
      {
        headers: this.setStaffHeader(),
      }
    );
  }

  checkIn(data: any): Observable<Present> {
    return this.http.post<Present>(
      this.urlstaff + CONSTANT.ENDPOINTS.CHECK_IN,
      data,
      {
        headers: this.setStaffHeader(),
      }
    );
  }

  checkOut(data: any): Observable<Present> {
    return this.http.patch<Present>(
      this.urlstaff + CONSTANT.ENDPOINTS.CHECK_OUT,
      data,
      {
        headers: this.setStaffHeader(),
      }
    );
  }

  checkInTableDetails(): Observable<CheckInData[]> {
    return this.http.get<CheckInData[]>(
      this.urlstaff + CONSTANT.ENDPOINTS.CHECK_IN_DETAILS,
      {
        headers: this.setStaffHeader(),
      }
    );
  }

  applyLeave(data: StaffLeave): Observable<Approve> {
    return this.http.post<Approve>(
      this.urlstaff + CONSTANT.ENDPOINTS.APPLY_LEAVE,
      data,
      {
        headers: this.setStaffHeader(),
      }
    );
  }

  getAppliedLeave(empid: string): Observable<StaffLeave[]> {
    return this.http.get<StaffLeave[]>(
      this.urlstaff + CONSTANT.ENDPOINTS.GET_APPLIED_LEAVE + empid,
      {
        headers: this.setStaffHeader(),
      }
    );
  }

  getApprovedLeave(empid: string): Observable<StaffLeave[]> {
    return this.http.get<StaffLeave[]>(
      this.urlstaff + CONSTANT.ENDPOINTS.GET_APPROVED_LEAVE + empid,
      {
        headers: this.setStaffHeader(),
      }
    );
  }

  deleteAppliedLeave(empid: string, fromdate: string): Observable<Delete> {
    return this.http.delete<Delete>(
      this.urlstaff + CONSTANT.ENDPOINTS.DELETE_LEAVE + empid + '?' + fromdate,
      {
        headers: this.setStaffHeader(),
      }
    );
  }

  updateProfile(data: Staff): Observable<Update> {
    return this.http.patch<Update>(
      this.url + CONSTANT.ENDPOINTS.UPDATE_STAFF,
      data,
      {
        headers: this.setStaffHeader(),
      }
    );
  }

  getApprovedLeaveForAdmin(empid: string): Observable<StaffLeave[]> {
    return this.http.get<StaffLeave[]>(
      this.urlstaff + CONSTANT.ENDPOINTS.GET_APPROVED_LEAVE + empid,
      {
        headers: this.setHeader(),
      }
    );
  }

  checkInTableDetailsForAdmin(): Observable<CheckInData[]> {
    return this.http.get<CheckInData[]>(
      this.urlstaff + CONSTANT.ENDPOINTS.CHECK_IN_DETAILS,
      {
        headers: this.setHeader(),
      }
    );
  }

  getAbsentDataForAdmin(empid: string): Observable<AbsentData[]> {
    return this.http.get<AbsentData[]>(
      this.urlstaff + CONSTANT.ENDPOINTS.GET_ABSENT + empid,
      {
        headers: this.setHeader(),
      }
    );
  }

  addAbsentData(data: any): Observable<Update> {
    return this.http.post<Update>(
      this.urlstaff + CONSTANT.ENDPOINTS.ADD_ABSENT,
      data,
      {
        headers: this.setStaffHeader(),
      }
    );
  }

  getAbsentData(empid: string): Observable<AbsentData[]> {
    return this.http.get<AbsentData[]>(
      this.urlstaff + CONSTANT.ENDPOINTS.GET_ABSENT + empid,
      {
        headers: this.setStaffHeader(),
      }
    );
  }

  getSalaryForStaff(empid: string): Observable<Salary[]> {
    return this.http.get<Salary[]>(
      this.urlstaff + CONSTANT.ENDPOINTS.GET_SALARY_FOR_STAFF + empid,
      {
        headers: this.setStaffHeader(),
      }
    );
  }

  addWorkDetails(data: Work): Observable<Insert> {
    return this.http.post<Insert>(
      this.urlstaff + CONSTANT.ENDPOINTS.ADD_WORK_DETAILS,
      data,
      {
        headers: this.setStaffHeader(),
      }
    );
  }

  getWorkDetails(empid: string): Observable<Work[]> {
    return this.http.get<Work[]>(
      this.urlstaff + CONSTANT.ENDPOINTS.GET_WORK_DETAILS + empid,
      {
        headers: this.setStaffHeader(),
      }
    );
  }

  getWorkDetailsUsingDate(empid: string, date: any): Observable<Work[]> {
    return this.http.get<Work[]>(
      this.urlstaff +
        CONSTANT.ENDPOINTS.GET_WORK_DETAILS_FOR_EMPLOYEE +
        empid +
        '&date=' +
        date,
      {
        headers: this.setStaffHeader(),
      }
    );
  }
}
