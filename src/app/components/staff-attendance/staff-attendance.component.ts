import { StaffService } from './../../services/staff.service';

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
  events: Array<{ title: string; date: string; color: string }> = [];
  calendarOptions: CalendarOptions;
  constructor(private staffService: StaffService) {}

  ngOnInit(): void {
    this.loggedInData = this.staffService.loggednInData();

    this.calendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin],
      events: [],
      firstDay: 1,
    };

    this.staffService.getApprovedLeave(this.loggedInData.empid).subscribe(
      (res) => {
        // console.log(res);
        if (res.length != 0) {
          for (let i = 0; i < res.length; i++) {
            const fromdate = moment(res[i].fromdate).format('YYYY-MM-DD');
            const todate = moment(res[i].todate).format('YYYY-MM-DD');
            if (fromdate == todate) {
              this.events.push({
                title: 'A',
                date: fromdate,
                color: '#dc3545',
              });
            } else {
              const dateArr = fromdate.split('-');
              const startdate = Number(fromdate.split('-')[2]);
              const enddate = Number(todate.split('-')[2]);

              for (let i = startdate; i <= enddate; i++) {
                // console.log(i);
                if (i <= 9) {
                  const leaveDate = dateArr[0] + '-' + dateArr[1] + '-0' + i;

                  // console.log(leaveDate);
                  this.events.push({
                    title: 'A',
                    date: leaveDate,
                    color: '#dc3545',
                  });
                } else {
                  const leaveDate = dateArr[0] + '-' + dateArr[1] + '-' + i;

                  // console.log(leaveDate);
                  this.events.push({
                    title: 'A',
                    date: leaveDate,
                    color: '#dc3545',
                  });
                }
              }
            }
          }
        }
      },
      (err) => {
        console.log(err);
      }
    );

    this.staffService.getAllLeave().subscribe(
      (res) => {
        // console.log(res);

        if (res.length != 0) {
          res = res.filter((data) => {
            return (data.leavedate = moment(data.leavedate).format(
              'YYYY-MM-DD'
            ));
          });

          // console.log(res);

          // console.log(res);
          for (let i = 0; i < res.length; i++) {
            this.events.push({
              title: 'O',
              date: res[i].leavedate,
              color: '#6c757d',
            });
          }

          // this.calendarOptions.events = this.events;
        }
      },
      (err) => {
        console.log(err);
      }
    );

    this.staffService.checkInTableDetails().subscribe(
      (res) => {
        if (res.length == 0) {
          this.calendarOptions.events = this.events;
        } else {
          res = res.filter((data) => {
            return data.empid == this.loggedInData.empid;
          });

          // console.log(res);
          for (let i = 0; i < res.length; i++) {
            const date = moment(res[i].checkin).format('YYYY-MM-DD');
            this.events.push({ title: 'P', date: date, color: '#388007' });
            // console.log(this.events);
          }
          this.calendarOptions.events = this.events;
          return;
        }
      },
      (err) => {
        // Swal.fire('Error!', 'Data not loaded!', 'error');
      }
    );
  }
}
