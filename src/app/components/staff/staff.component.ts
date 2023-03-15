import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css', '../../admin/admin.css'],
})
export class StaffComponent implements OnInit {
  loggedInData: any;
  constructor(private cookieService: CookieService) {}

  ngOnInit(): void {
    this.loggedInData = JSON.parse(this.cookieService.get('loggedInData'));
  }
}
