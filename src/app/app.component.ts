import { AuthService } from './services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'office-management-system';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService
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
    // console.log(!token);
    if (!adminToken) {
      const userAuthToken = this.cookieService.get('userAuthToken');
      // console.log(userAuthToken);
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
        console.log('unable to logout', err);
      }
    );
  }
}
