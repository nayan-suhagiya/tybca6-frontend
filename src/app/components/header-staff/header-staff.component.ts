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
  present: boolean;

  constructor(
    private cookieService: CookieService,
    private staffService: StaffService
  ) {}

  ngOnInit(): void {
    this.present = this.staffService.isCheckedIn();
  }

  checkIn() {
    const empid = this.loggedInData.empid;
    // const checkIn = moment(new Date()).format('DD-MM-YYYY hh:mm:ss');
    // this.checkInDate = new Date();
    // console.log('checked in clicked!', this.checkInDate);

    // console.log(this.checkInData);

    this.staffService.checkIn({ empid }).subscribe(
      (res) => {
        // console.log(res);
        if (res.present) {
          this.cookieService.set('checkInDetails', JSON.stringify(res));
          this.cookieService.set('isCheckedIn', 'true');
        } else {
          alert('something went wrong!');
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
