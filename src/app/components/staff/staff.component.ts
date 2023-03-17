import { StaffService } from './../../services/staff.service';
import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css', '../../admin/admin.css'],
})
export class StaffComponent implements OnInit {
  loggedInData: any;
  checkin: boolean = false;
  checkout: boolean = false;

  constructor(
    private cookieService: CookieService,
    private staffService: StaffService
  ) {}

  ngOnInit(): void {
    this.loggedInData = this.staffService.loggednInData();
  }

  checkIn() {
    const empid = this.loggedInData.empid;

    this.staffService.checkIn({ empid }).subscribe(
      (res) => {
        // console.log(res);
        if (res.present) {
          // this.cookieService.set('isCheckedIn', 'true');
          this.checkin = res.present;
          this.cookieService.set('checkInDetails', JSON.stringify(res));
          this.ngOnInit();
        } else {
          alert('something went wrong!');
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  checkOut() {
    const empid = this.loggedInData.empid;

    this.staffService.checkOut({ empid }).subscribe(
      (res) => {
        // console.log(res);
        if (!res.present) {
          this.checkout = res.present;
          // this.ngOnInit();
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
