import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Dept } from './../models/Dept';
import { Delete, Insert, Update } from './../models/ResponseModel';

@Injectable({
  providedIn: 'root',
})
export class DeptService {
  // url: string = 'http://localhost:3000/admin';
  // url: string = 'http://192.168.0.172:5000/admin';
  url: string = 'http://54.227.125.254:3000/admin';

  constructor(private http: HttpClient) {}

  setHeader() {
    const token = sessionStorage.getItem('authToken');

    return new HttpHeaders().set('Authorization', 'Bearer ' + token);
  }

  getDepartments(): Observable<Dept[]> {
    return this.http.get<Dept[]>(this.url + '/get-depts', {
      headers: this.setHeader(),
    });
  }

  addDepartment(data: Dept): Observable<Insert> {
    return this.http.post<Insert>(this.url + '/add-dept', data, {
      headers: this.setHeader(),
    });
  }

  updateDepartment(data: Dept): Observable<Update> {
    return this.http.patch<Update>(this.url + '/update-dept', data, {
      headers: this.setHeader(),
    });
  }

  deleteDepartment(deptid: string): Observable<Delete> {
    return this.http.delete<Delete>(this.url + `/delete-dept/${deptid}`, {
      headers: this.setHeader(),
    });
  }
}
