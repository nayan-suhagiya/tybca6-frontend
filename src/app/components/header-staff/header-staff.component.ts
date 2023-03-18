import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { StaffService } from './../../services/staff.service';
import { CookieService } from 'ngx-cookie-service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header-staff',
  templateUrl: './header-staff.component.html',
  styleUrls: ['./header-staff.component.css', '../../admin/admin.css'],
})
export class HeaderStaffComponent implements OnInit {
  @Input() loggedInData: any;

  constructor(
    private cookieService: CookieService,
    private staffService: StaffService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLogin()) {
      this.router.navigate(['/login']);
      return;
    }
  }

  isLogin() {
    return this.authService.isLogin();
  }

  logOut() {
    const adminToken = this.cookieService.get('authToken');
    if (!adminToken) {
      const userAuthToken = this.cookieService.get('userAuthToken');
      this.callLogOut(userAuthToken);
    } else {
      this.callLogOut(adminToken);
    }
  }

  callLogOut(token: string) {
    this.authService.logout(token).subscribe(
      (res) => {
        this.cookieService.deleteAll();
        this.router.navigate(['/login']);
      },
      (err) => {
        Swal.fire('Error!', 'Unable to logout!', 'error');
      }
    );
  }
}
