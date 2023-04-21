import { NgxSpinnerService } from 'ngx-spinner';
import { StaffService } from './../../services/staff.service';

import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css', '../../admin/admin.css'],
})
export class StaffComponent implements OnInit {
  dpart: string = 'Dashboard';
  loggedInData: any;
  totalLeaveRequest: number;
  checkin: boolean;
  checkout: boolean;
  date: string = new Date().toString();
  totalGainSalary: number = 0;
  leaveDateArr: any = [];
  isleave: boolean = false;
  isoffday: boolean = false;

  constructor(
    private staffService: StaffService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    setInterval(() => {
      this.date = new Date().toString();
    }, 1000);
    this.loggedInData = this.staffService.loggednInData();

    this.staffService.getAppliedLeave(this.loggedInData.empid).subscribe(
      (res) => {
        this.totalLeaveRequest = res.length;
      },
      (err) => {
        console.log(err);
      }
    );

    const day = this.date.split(' ')[0];

    if (day == 'Sat' || day == 'Sun') {
      this.checkin = true;
      this.checkout = true;
      this.isoffday = true;
      return;
    }

    this.staffService
      .getApprovedLeave(this.loggedInData.empid)
      .subscribe((res) => {
        const today = moment(new Date()).format('YYYY-MM-DD');

        const filteredData = res.filter((data) => {
          return moment(data.fromdate).format('YYYY-MM-DD') == today;
        });

        if (filteredData.length !== 0) {
          const fromdate = moment(filteredData[0].fromdate).format(
            'YYYY-MM-DD'
          );
          const todate = moment(filteredData[0].todate).format('YYYY-MM-DD');

          if (fromdate == todate) {
            if (fromdate == today) {
              this.checkin = true;
              this.checkout = true;
              this.isleave = true;
            } else {
              this.checkin = false;
              this.checkout = false;
            }
          } else {
            const dateArr = fromdate.split('-');
            const startdate = Number(fromdate.split('-')[2]);
            const enddate = Number(todate.split('-')[2]);

            for (let i = startdate; i <= enddate; i++) {
              const today = moment(new Date()).format('YYYY-MM-DD');
              if (i <= 9) {
                const leaveDate = dateArr[0] + '-' + dateArr[1] + '-0' + i;
                this.leaveDateArr.push(leaveDate);
              } else {
                const leaveDate = dateArr[0] + '-' + dateArr[1] + '-' + i;
                this.leaveDateArr.push(leaveDate);
              }
            }

            this.leaveDateArr = this.leaveDateArr.filter((date) => {
              return today == date;
            });

            if (this.leaveDateArr.length == 0) {
              this.checkin = false;
              this.checkout = false;
            } else {
              this.checkin = true;
              this.checkout = true;
              this.isleave = true;
            }
          }
        }

        if (this.checkin == true && this.checkout == true) {
          return;
        } else {
          this.staffService.checkInTableDetails().subscribe(
            (res) => {
              const newRes = res.filter((data) => {
                return data.empid == this.loggedInData.empid;
              });

              const data = newRes.filter((data) => {
                return today == moment(data.checkin).format('YYYY-MM-DD');
              });

              if (data.length == 0) {
                this.checkin = false;
                this.checkout = false;
              } else {
                if (data[0].checkin == null) {
                  this.checkin = false;
                } else {
                  this.checkin = true;
                }

                if (data[0].checkout == null) {
                  this.checkout = false;
                } else {
                  this.checkout = true;
                }
              }
            },
            (err) => {
              console.log(err);
            }
          );
        }
      });

    this.staffService.getSalaryForStaff(this.loggedInData.empid).subscribe(
      (res) => {
        if (res.length != 0) {
          for (let data of res) {
            this.totalGainSalary += data.netpay;
          }
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  checkIn() {
    const empid = this.loggedInData.empid;

    this.staffService.checkInTableDetails().subscribe(
      (res) => {
        const filteredRes = res.filter((data) => {
          return data.empid == this.loggedInData.empid;
        });

        if (filteredRes.length <= 0) {
          this.staffService.checkIn({ empid }).subscribe(
            (res) => {
              if (res.present) {
                Swal.fire('Success!', 'Checked IN!', 'success');
                sessionStorage.setItem('checkInDetails', JSON.stringify(res));
                this.ngOnInit();
              } else {
                Swal.fire('Warning!', 'Something went wrong!', 'warning');
              }
            },
            (err) => {
              console.log(err);
            }
          );
        } else {
          this.staffService.checkIn({ empid }).subscribe(
            (res) => {
              if (res.present) {
                Swal.fire('Success!', 'Checked IN!', 'success');
                sessionStorage.setItem('checkInDetails', JSON.stringify(res));
                this.ngOnInit();
              } else {
                Swal.fire('Warning!', 'Something went wrong!', 'warning');
              }
            },
            (err) => {
              console.log(err);
            }
          );
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  checkOut() {
    const empid = this.loggedInData.empid;
    const date = moment(new Date()).format('YYYY-MM-DD');

    this.staffService.checkInTableDetails().subscribe(
      (res) => {
        res = res.filter((data) => {
          return data.empid == this.loggedInData.empid;
        });

        if (res.length <= 0) {
          this.staffService.checkOut({ empid, date }).subscribe(
            (res) => {
              if (res.present == false) {
                this.ngOnInit();
                Swal.fire('Success!', 'Checked OUT!', 'success');
              } else {
                Swal.fire('Warning!', 'Something went wrong!', 'warning');
              }
            },
            (err) => {
              Swal.fire('Warning!', 'Please first checkIN!', 'warning');
            }
          );
        } else {
          const today = moment(new Date()).format('YYYY-MM-DD');

          for (let checkin of res) {
            if (today == moment(checkin.checkout).format('YYYY-MM-DD')) {
              Swal.fire('Warning!', 'Already checked out!', 'warning');
            } else {
              this.staffService.checkOut({ empid, date }).subscribe(
                (res) => {
                  if (res.present == false) {
                    this.ngOnInit();
                    Swal.fire('Success!', 'Checked OUT!', 'success');
                  } else {
                    Swal.fire('Warning!', 'Something went wrong!', 'warning');
                  }
                },
                (err) => {
                  Swal.fire('Warning!', 'Please first checkIN!', 'warning');
                }
              );
            }
          }
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
