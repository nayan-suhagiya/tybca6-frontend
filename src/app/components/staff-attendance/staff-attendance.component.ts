import { StaffService } from './../../services/staff.service';
import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-staff-attendance',
  templateUrl: './staff-attendance.component.html',
  styleUrls: ['../../admin/admin.css'],
})
export class StaffAttendanceComponent implements OnInit {
  loggedInData: any;
  checkInDetails: any;
  events: Array<{ title: string; date: string; color: string }> = [];
  calendarOptions: CalendarOptions;
  constructor(
    private cookieService: CookieService,
    private staffService: StaffService
  ) {}

  ngOnInit(): void {
    this.loggedInData = this.staffService.loggednInData();

    this.calendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin],
      events: [],
    };

    this.staffService.checkInTableDetails().subscribe(
      (res) => {
        res = res.filter((data) => {
          return data.empid == this.loggedInData.empid;
        });

        for (let i = 0; i < res.length; i++) {
          const date = moment(res[i].checkin).format('YYYY-MM-DD');
          this.events.push({ title: 'P', date: date, color: '#388007' });
        }
        this.calendarOptions.events = this.events;
        return;
      },
      (err) => {
        Swal.fire('Error!', 'Data not loaded!', 'error');
      }
    );
  }
}
