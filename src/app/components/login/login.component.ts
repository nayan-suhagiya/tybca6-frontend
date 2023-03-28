import { StaffService } from './../../services/staff.service';

import { AuthService } from './../../services/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/models/Login';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm') loginForm: NgForm;
  loginData: Login = new Login();

  constructor(
    private authService: AuthService,
    private router: Router,

    private spinner: NgxSpinnerService,
    private staffService: StaffService
  ) {}

  ngOnInit(): void {}

  loginSubmit() {
    this.spinner.show();
    sessionStorage.clear();
    this.authService.login(this.loginData).subscribe(
      (res: any) => {
        this.loginForm.reset();
        if (res.role == 'admin') {
          setTimeout(() => {
            this.spinner.hide();
          }, 3000);
          this.router.navigate(['/admin']);
          sessionStorage.setItem('isAdminLogin', 'true');
          sessionStorage.setItem('authToken', res.token);
        } else if (res.role == 'user') {
          setTimeout(() => {
            this.spinner.hide();
          }, 3000);
          this.router.navigate(['/staff']);
          sessionStorage.setItem('loggedInData', JSON.stringify(res));
          sessionStorage.setItem('isStaffLogin', 'true');
          sessionStorage.setItem('userAuthToken', res.token);
        }
      },
      (err) => {
        setTimeout(() => {
          this.spinner.hide();
        }, 3000);
        if (err.error.message == undefined) {
          Swal.fire('Warning!', 'Check credentials!', 'warning');
        } else {
          Swal.fire('Error!', 'Server Error!', 'error');
        }
      }
    );
  }
}
