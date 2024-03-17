import { NgxSpinnerService } from 'ngx-spinner';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { StaffService } from './../../services/staff.service';
import { DeptService } from './../../services/dept.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-admin-attendance',
  templateUrl: './admin-attendance.component.html',
  styleUrls: ['../main.css'],
})
export class AdminAttendanceComponent implements OnInit {
  dpart: string = 'Attendance';
  allDeptData: any;
  allDeptName: string[] = [];
  staffData: any;
  staffName: string[] = [];
  staffNameLength: number = 0;
  checkInDetails: any;
  allMonthDay: any = [];
  events: Array<{ title: string; date: string; color: string }> = [];
  calendarOptions: CalendarOptions;
  calendarShow: boolean = false;

  constructor(
    private deptService: DeptService,
    private staffService: StaffService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData() {
    this.spinner.show();

    this.deptService.getDepartments().subscribe(
      (res) => {
        this.allDeptData = res;
        for (let dept of res) {
          if (!this.allDeptName.includes(dept.dname)) {
            this.allDeptName.push(dept.dname);
          }
        }
      },
      (err) => {
        console.log(err);
        this.spinner.hide();
      }
    );

    this.calendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin],
      events: [],
      firstDay: 1,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridWeek,dayGridMonth', // user can switch between the two
      },
    };

    this.spinner.hide();
  }

  getStaffData(event) {
    this.spinner.show();

    this.staffName = [];
    this.calendarOptions.events = [];
    this.staffNameLength = 0;
    this.calendarShow = false;

    if (event.target.value == '') {
      this.spinner.hide();
      return;
    }

    this.staffService.getStaffUsingDname(event.target.value).subscribe(
      (res) => {
        if (res.length === 0) {
          this.spinner.hide();
          return;
        }
        if (res.length != 0) {
          this.staffData = res;
          this.staffNameLength = res.length;
          for (let data of res) {
            this.staffName.push(data.fname);
          }
          this.spinner.hide();
        }
      },
      (err) => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  filterStaff(event) {
    this.spinner.show();

    const staff = this.staffData.filter((data) => {
      return data.fname == event.target.value;
    });

    if (staff.length == 0) {
      this.spinner.hide();
      this.calendarShow = false;
      return;
    }

    this.calendarShow = true;
    this.events = [];
    this.allMonthDay = [];

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

    this.staffService.getApprovedLeaveForAdmin(staff[0].empid).subscribe(
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

    this.staffService.checkInTableDetailsForAdmin().subscribe(
      (res) => {
        if (res.length == 0) {
          this.calendarOptions.events = this.events;
        } else {
          res = res.filter((data) => {
            return data.empid == staff[0].empid;
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

          this.staffService.getAbsentDataForAdmin(staff[0].empid).subscribe(
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
              this.spinner.hide();
            },
            (err) => {
              console.log(err);
              this.spinner.hide();
            }
          );
        }
      },
      (err) => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }
}
