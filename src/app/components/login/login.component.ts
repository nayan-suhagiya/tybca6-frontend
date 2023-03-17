import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/models/Login';

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
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {}

  loginSubmit() {
    this.authService.login(this.loginData).subscribe(
      (res: any) => {
        // console.log(res);
        this.loginForm.reset();
        if (res.role == 'admin') {
          this.router.navigate(['/admin']);
          this.cookieService.set('isLogin', 'true', {
            expires: new Date(Date.now() + 90000000),
          });
          this.cookieService.set('authToken', res.token, {
            expires: new Date(Date.now() + 90000000),
          });
        } else if (res.role == 'user') {
          // console.log(JSON.stringify(res));
          this.cookieService.set('loggedInData', JSON.stringify(res));
          this.router.navigate(['/staff']);
          this.cookieService.set('isLogin', 'true', {
            expires: new Date(Date.now() + 90000000),
          });
          this.cookieService.delete('userAuthToken');
          this.cookieService.set('userAuthToken', res.token, {
            expires: new Date(Date.now() + 90000000),
          });
        }
      },
      (err) => {
        // console.log(err.error.message);
        if (err.error.message == undefined) {
          alert('Check credentials!');
        } else {
          alert(err.error.message);
        }
      }
    );
  }
}
