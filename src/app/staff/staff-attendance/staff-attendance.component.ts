import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import * as moment from 'moment';
import { StaffService } from '../../services/staff.service';

@Component({
  selector: 'app-staff-attendance',
  templateUrl: './staff-attendance.component.html',
  styleUrls: ['../../admin/main.css'],
})
export class StaffAttendanceComponent implements OnInit {
  dpart: string = 'Attendance';
  loggedInData: any;
  checkInDetails: any;
  allMonthDay: any = [];
  events: Array<{ title: string; date: string; color: string }> = [];
  calendarOptions: CalendarOptions;

  constructor(
    private staffService: StaffService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show(); // Show spinner during initial loading

    this.loggedInData = this.staffService.loggednInData();

    const date = new Date();
    const y = date.getFullYear();
    const m = date.getMonth();
    const firstDay = moment(new Date(y, m, 1)).format('YYYY-MM-DD');
    const lastDay = moment(new Date(y, m + 1, 0)).format('YYYY-MM-DD');

    const dateArr = firstDay.split('-');
    const startdate = Number(firstDay.split('-')[2]);
    const enddate = Number(lastDay.split('-')[2]);

    for (let i = startdate; i <= enddate; i++) {
      if (i <= 9) {
        const date = dateArr[0] + '-' + dateArr[1] + '-0' + i;
        this.allMonthDay.push(date);
      } else {
        const date = dateArr[0] + '-' + dateArr[1] + '-' + i;
        this.allMonthDay.push(date);
      }
    }

    this.calendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin],
      events: [],
      firstDay: 1,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridWeek,dayGridMonth',
      },
    };

    this.staffService.getApprovedLeave(this.loggedInData.empid).subscribe(
      (res) => {
        if (res.length != 0) {
          for (let i = 0; i < res.length; i++) {
            const fromdate = moment(res[i].fromdate).format('YYYY-MM-DD');
            const todate = moment(res[i].todate).format('YYYY-MM-DD');
            if (fromdate == todate) {
              this.events.push({
                title: 'Leave',
                date: fromdate,
                color: '#96c521',
              });
            } else {
              const dateArr = fromdate.split('-');
              const startdate = Number(fromdate.split('-')[2]);
              const enddate = Number(todate.split('-')[2]);

              for (let i = startdate; i <= enddate; i++) {
                if (i <= 9) {
                  const leaveDate = dateArr[0] + '-' + dateArr[1] + '-0' + i;
                  this.events.push({
                    title: 'Leave',
                    date: leaveDate,
                    color: '#96c521',
                  });
                } else {
                  const leaveDate = dateArr[0] + '-' + dateArr[1] + '-' + i;
                  this.events.push({
                    title: 'Leave',
                    date: leaveDate,
                    color: '#96c521',
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
        if (res.length != 0) {
          res = res.filter((data) => {
            return (data.leavedate = moment(data.leavedate).format(
              'YYYY-MM-DD'
            ));
          });

          for (let i = 0; i < res.length; i++) {
            this.events.push({
              title: 'O',
              date: res[i].leavedate,
              color: '#ABADAF',
            });
          }
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

          for (let i = 0; i < res.length; i++) {
            const date = moment(res[i].checkin).format('YYYY-MM-DD');
            this.events.push({ title: 'P', date: date, color: '#388007' });
          }

          for (let i of this.events) {
            this.allMonthDay = this.allMonthDay.filter((data) => {
              return data != i.date;
            });
          }

          this.staffService
            .addAbsentData({
              empid: this.loggedInData.empid,
              date: this.allMonthDay,
              month: m + 1,
              year: y,
            })
            .subscribe(
              (res) => {
                this.staffService
                  .getAbsentData(this.loggedInData.empid)
                  .subscribe(
                    (res) => {
                      for (let i = 0; i < res.length; i++) {
                        for (let data of res[i].date) {
                          const date = moment(data).format('YYYY-MM-DD');
                          const today = moment(new Date()).format('YYYY-MM-DD');
                          if (date < today) {
                            this.events.push({
                              title: 'A',
                              date: date,
                              color: '#dc3545',
                            });
                          }
                        }
                      }
                      this.calendarOptions.events = this.events;
                    },
                    (err) => {
                      console.log(err);
                    },
                    () => {
                      this.spinner.hide(); // Hide spinner after API call completes
                    }
                  );
              },
              (err) => {
                console.log(err);
              }
            );
        }
      },
      (err) => {
        console.log(err);
      },
      () => {
        this.spinner.hide(); // Hide spinner after all API calls complete
      }
    );
  }
}
