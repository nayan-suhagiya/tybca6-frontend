import { StaffService } from './../../services/staff.service';
import { CookieService } from 'ngx-cookie-service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-header-staff',
  templateUrl: './header-staff.component.html',
  styleUrls: ['./header-staff.component.css', '../../admin/admin.css'],
})
export class HeaderStaffComponent implements OnInit {
  @Input() loggedInData: any;

  constructor(
    private cookieService: CookieService,
    private staffService: StaffService
  ) {}

  ngOnInit(): void {}
}
