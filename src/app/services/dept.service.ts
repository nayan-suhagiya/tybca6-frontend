import { HttpClient } from '@angular/common/http';
import { Dept } from './../models/Dept';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeptService {
  url: string = 'http://localhost:5000/admin';
  // url: string = 'http://192.168.0.172:5000/admin';

  constructor(private http: HttpClient) {}

  setHeader() {
    const token = sessionStorage.getItem('authToken');

    return new HttpHeaders().set('Authorization', 'Bearer ' + token);
  }

  getDepartments(): Observable<any> {
    return this.http.get(this.url + '/get-depts', {
      headers: this.setHeader(),
    });
  }

  addDepartment(data: Dept): Observable<any> {
    return this.http.post(this.url + '/add-dept', data, {
      headers: this.setHeader(),
    });
  }

  updateDepartment(data: Dept): Observable<any> {
    return this.http.patch(this.url + '/update-dept', data, {
      headers: this.setHeader(),
    });
  }

  deleteDepartment(deptid: string): Observable<any> {
    return this.http.delete(this.url + `/delete-dept/${deptid}`, {
      headers: this.setHeader(),
    });
  }
}
