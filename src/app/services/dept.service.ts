import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Dept } from './../models/Dept';
import { Delete, Insert, Update } from './../models/ResponseModel';
import { environment } from 'src/environments/environment.prod';
import { CONSTANT } from '../constant/constant';

@Injectable({
  providedIn: 'root',
})
export class DeptService {
  url: string = environment.ADMIN_API_ENDPOINT;

  constructor(private http: HttpClient) {}

  setHeader() {
    const token = sessionStorage.getItem('authToken');

    return new HttpHeaders().set('Authorization', 'Bearer ' + token);
  }

  getDepartments(): Observable<Dept[]> {
    return this.http.get<Dept[]>(
      this.url + CONSTANT.ENDPOINTS.GET_DEPARTMENTS,
      {
        headers: this.setHeader(),
      }
    );
  }

  addDepartment(data: Dept): Observable<Insert> {
    return this.http.post<Insert>(
      this.url + CONSTANT.ENDPOINTS.ADD_DEPARTMENT,
      data,
      {
        headers: this.setHeader(),
      }
    );
  }

  updateDepartment(data: Dept): Observable<Update> {
    return this.http.patch<Update>(
      this.url + CONSTANT.ENDPOINTS.UPDATE_DEPARTMENT,
      data,
      {
        headers: this.setHeader(),
      }
    );
  }

  deleteDepartment(deptid: string): Observable<Delete> {
    return this.http.delete<Delete>(
      this.url + CONSTANT.ENDPOINTS.DELETE_DEPARTMENT + deptid,
      {
        headers: this.setHeader(),
      }
    );
  }
}
