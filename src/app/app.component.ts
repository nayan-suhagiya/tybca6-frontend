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

  ngOnInit(): void {}
}
