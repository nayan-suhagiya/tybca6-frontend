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

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  setHeader() {
    const token = this.cookieService.get('authToken');

    return new HttpHeaders().set('Authorization', 'Bearer ' + token);
  }

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
}
