import { NgxSpinnerService } from 'ngx-spinner';
import { StaffService } from '../../services/staff.service';

import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css', '../../admin/main.css'],
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
  todayData: any = [];
  todaydataLength: number = 0;

  constructor(
    private staffService: StaffService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    // this.totalGainSalary = 0;
    const today = moment(new Date()).format('YYYY-MM-DD');

    setInterval(() => {
      this.date = new Date().toString();
    }, 1000);
    this.loggedInData = this.staffService.loggednInData();

    this.staffService.getAppliedLeave(this.loggedInData.empid).subscribe(
      (res) => {
        this.spinner.hide();
        this.totalLeaveRequest = res.length;
      },
      (err) => {
        this.spinner.hide();
        console.log(err);
      }
    );

    this.staffService.getSalaryForStaff(this.loggedInData.empid).subscribe(
      (res) => {
        this.spinner.hide();
        if (res.length != 0) {
          this.totalGainSalary = 0;
          for (let data of res) {
            this.totalGainSalary += data.netpay;
          }
        }
      },
      (err) => {
        this.spinner.hide();
        console.log(err);
      }
    );

    //
    this.staffService.getWorkDetails(this.loggedInData.empid).subscribe(
      (res) => {
        this.spinner.hide();
        // console.log(res);
        const today = moment(new Date()).format('YYYY-MM-DD');
        if (res.length !== 0) {
          this.todayData = res.filter((data) => {
            return today == moment(data.date).format('YYYY-MM-DD');
          });

          this.todaydataLength = this.todayData.length;

          // console.log(this.todayData);
        } else {
          this.todaydataLength = 0;
        }
      },
      (err) => {
        this.spinner.hide();
        console.log(err);
      }
    );

    // const day = this.date.split(' ')[0];

    // if (day == 'Sat' || day == 'Sun') {
    //   this.checkin = true;
    //   this.checkout = true;
    //   this.isoffday = true;
    //   return;
    // }

    // console.log('execution continue');

    this.staffService
      .getApprovedLeave(this.loggedInData.empid)
      .subscribe((res) => {
        this.spinner.hide();
        const today = moment(new Date()).format('YYYY-MM-DD');

        // console.log(res);

        if (res.length !== 0) {
          for (let i = 0; i < res.length; i++) {
            const fromdate = moment(res[i].fromdate).format('YYYY-MM-DD');
            const todate = moment(res[i].todate).format('YYYY-MM-DD');

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
        }

        if (this.checkin == true && this.checkout == true) {
          return;
        } else {
          this.staffService.checkInTableDetails().subscribe(
            (res) => {
              this.spinner.hide();
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
              this.spinner.hide();
              console.log(err);
            },
            () => {
              // console.log('final time check detauils of checkin and checkout');
              this.staffService.getLeaveByDate(today).subscribe(
                (res) => {
                  // console.log(res.founded);
                  this.spinner.hide();
                  if (res.founded) {
                    this.spinner.hide();
                    this.checkin = true;
                    this.checkout = true;
                    this.isoffday = true;
                  }
                },
                (err) => {
                  this.spinner.hide();
                  console.log(err);
                  // return;
                }
              );
            }
          );
        }

        // console.log(this.checkin, this.checkout);
      });
  }

  checkIn() {
    this.spinner.show();
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
                this.spinner.hide();
                Swal.fire('Success!', 'Checked IN!', 'success');
                sessionStorage.setItem('checkInDetails', JSON.stringify(res));
                this.ngOnInit();
              } else {
                this.spinner.hide();
                Swal.fire(
                  'Warning!',
                  'Something went wrong! or unable to checkin',
                  'warning'
                );
              }
            },
            (err) => {
              this.spinner.hide();
              console.log(err);
            }
          );
        } else {
          this.staffService.checkIn({ empid }).subscribe(
            (res) => {
              if (res.present) {
                this.spinner.hide();
                Swal.fire('Success!', 'Checked IN!', 'success');
                sessionStorage.setItem('checkInDetails', JSON.stringify(res));
                this.ngOnInit();
              } else {
                this.spinner.hide();
                Swal.fire(
                  'Warning!',
                  'Something went wrong! or unable to checkin',
                  'warning'
                );
              }
            },
            (err) => {
              this.spinner.hide();
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
    this.spinner.show();
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
                this.spinner.hide();
                this.ngOnInit();
                Swal.fire('Success!', 'Checked OUT!', 'success');
              } else {
                this.spinner.hide();
                Swal.fire('Warning!', 'Something went wrong!', 'warning');
              }
            },
            (err) => {
              this.spinner.hide();
              Swal.fire('Warning!', 'Please first checkIN!', 'warning');
            }
          );
        } else {
          const today = moment(new Date()).format('YYYY-MM-DD');

          for (let checkin of res) {
            if (today == moment(checkin.checkout).format('YYYY-MM-DD')) {
              this.spinner.hide();
              Swal.fire('Warning!', 'Already checked out!', 'warning');
            } else {
              this.staffService.checkOut({ empid, date }).subscribe(
                (res) => {
                  if (res.present == false) {
                    this.spinner.hide();
                    this.ngOnInit();
                    Swal.fire('Success!', 'Checked OUT!', 'success');
                  } else {
                    this.spinner.hide();
                    Swal.fire('Warning!', 'Something went wrong!', 'warning');
                  }
                },
                (err) => {
                  this.spinner.hide();
                  Swal.fire('Warning!', 'Please first checkIN!', 'warning');
                }
              );
            }
          }
        }
      },
      (err) => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }
}
