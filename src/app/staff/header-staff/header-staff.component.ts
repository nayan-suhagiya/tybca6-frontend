import { HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../services/auth.service';

import { Component, Input, OnInit } from '@angular/core';
import { StaffService } from 'src/app/services/staff.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header-staff',
  templateUrl: './header-staff.component.html',
  styleUrls: ['./header-staff.component.css', '../../admin/main.css'],
})
export class HeaderStaffComponent implements OnInit {
  @Input() loggedInData: any;
  @Input() dpart: any;
  isFullScreen: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,

    private spinner: NgxSpinnerService,
    private staffService: StaffService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isStaffLogin()) {
      this.router.navigate(['/login']);
      return;
    }
  }

  isLogin() {
    return this.authService.isStaffLogin();
  }

  logOut() {
    const searchDate = moment(Date.now()).format('YYYY-MM-DD');
    this.staffService
      .getWorkDetailsUsingDate(this.loggedInData.empid, searchDate)
      .subscribe(
        (res) => {
          // console.log(res);
          if (res.length == 0) {
            Swal.fire('Warning!', 'Please add today work details!', 'warning');
          } else {
            const adminToken = sessionStorage.getItem('authToken');
            if (!adminToken) {
              const userAuthToken = sessionStorage.getItem('userAuthToken');
              this.callLogOut(userAuthToken);
            } else {
              this.callLogOut(adminToken);
            }
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

  callLogOut(token: string) {
    this.spinner.show();
    this.authService.logout(token).subscribe(
      (res) => {
        sessionStorage.clear();
        this.spinner.hide();
        this.router.navigate(['/login']);
      },
      (err) => {
        this.spinner.hide();
        // Swal.fire('Error!', 'Unable to logout!', 'error');
      }
    );
  }
}
