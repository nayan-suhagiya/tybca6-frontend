import { StaffService } from './../../services/staff.service';
import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import * as moment from 'moment';

@Component({
  selector: 'app-staff-attendance',
  templateUrl: './staff-attendance.component.html',
  styleUrls: ['../../admin/admin.css'],
})
export class StaffAttendanceComponent implements OnInit {
  loggedInData: any;
  checkInDetails: any;
  date: string;
  calendarOptions: CalendarOptions;
  constructor(
    private cookieService: CookieService,
    private staffService: StaffService
  ) {}
  ngOnInit(): void {
    this.loggedInData = this.staffService.loggednInData();

    const checkInDetails = this.cookieService.get('checkInDetails');

    if (!checkInDetails) {
      this.calendarOptions = {
        initialView: 'dayGridMonth',
        plugins: [dayGridPlugin],
        events: [
          // { title: 'P', date: this.date, color: '#388007' },
          {
            title: 'A',
            date: moment(new Date()).format('YYYY-MM-DD'),
            color: '#dc3545',
          },
        ],
      };
    } else {
      this.checkInDetails = JSON.parse(checkInDetails);

      this.date = moment(this.checkInDetails.checkinDate).format('YYYY-MM-DD');

      if (this.checkInDetails.present) {
        this.calendarOptions = {
          initialView: 'dayGridMonth',
          plugins: [dayGridPlugin],
          events: [
            { title: 'P', date: this.date, color: '#388007' },
            // { title: 'A', date: '2023-03-17', color: '#dc3545' },
          ],
        };
        return;
      }
    }
  }
}
