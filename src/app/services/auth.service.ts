import { Router } from '@angular/router';

import { Login } from './../models/Login';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url: string = 'http://localhost:5000';
  // url: string = 'http://192.168.0.172:5000';

  constructor(
    private http: HttpClient,

    private router: Router
  ) {}

  isAdminLogin() {
    let isAdminLogin = sessionStorage.getItem('isAdminLogin');

    if (isAdminLogin == 'true') {
      return true;
    } else {
      return false;
    }
  }

  isStaffLogin() {
    let isStaffLogin = sessionStorage.getItem('isStaffLogin');

    if (isStaffLogin == 'true') {
      return true;
    } else {
      return false;
    }
  }

  login(data: Login): Observable<any> {
    return this.http.post(this.url + '/login', data);
  }

  logout(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.get(this.url + '/logout', { headers });
  }
}
