import { AuthService } from '../../services/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/models/Login';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../login.css'],
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm') loginForm: NgForm;
  loginData: Login = new Login();
  password;
  show: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.password = 'password';
  }

  loginSubmit() {
    this.spinner.show();
    sessionStorage.clear();
    this.authService.login(this.loginData).subscribe(
      (res: any) => {
        this.loginForm.reset();
        if (res.role == 'admin') {
          this.router.navigate(['/admin']);
          sessionStorage.setItem('isAdminLogin', 'true');
          sessionStorage.setItem('authToken', res.token);
          this.spinner.hide();
        } else if (res.role == 'user') {
          this.router.navigate(['/staff']);
          sessionStorage.setItem('loggedInData', JSON.stringify(res));
          sessionStorage.setItem('isStaffLogin', 'true');
          sessionStorage.setItem('userAuthToken', res.token);
          this.spinner.hide();
        }
      },
      (err) => {
        setTimeout(() => {
          this.spinner.hide();
          if (err.error.message == undefined) {
            Swal.fire(
              'Warning!',
              'Check credentials! or Please see your Email for password!',
              'warning'
            );
          } else {
            Swal.fire('Error!', 'Server Error!', 'error');
          }
        }, 3000);
      }
    );
  }

  showHideClick() {
    if (this.password === 'password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'password';
      this.show = false;
    }
  }
}
