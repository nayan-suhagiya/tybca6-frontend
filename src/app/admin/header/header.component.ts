import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['../admin.css'],
})
export class HeaderComponent implements OnInit {
  @Input() part = '';
  constructor(private authService: AuthService, private router: Router) {}

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
    const adminToken = sessionStorage.getItem('authToken');
    if (!adminToken) {
      const userAuthToken = sessionStorage.getItem('userAuthToken');
      this.callLogOut(userAuthToken);
    } else {
      this.callLogOut(adminToken);
    }
  }

  callLogOut(token: string) {
    this.authService.logout(token).subscribe(
      (res) => {
        sessionStorage.clear();
        this.router.navigate(['/login']);
      },
      (err) => {
        Swal.fire('Error!', 'Unnable to logout!', 'error');
      }
    );
  }
}
