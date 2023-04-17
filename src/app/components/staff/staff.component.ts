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
  loggedInData: any;
  totalLeaveRequest: number;
  checkin: boolean = false;
  checkout: boolean = false;
  date: string = new Date().toString();
  totalGainSalary: number = 0;

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
        // console.log(res);
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
      return;
    }

    this.staffService.getApprovedLeave(this.loggedInData.empid).subscribe(
      (res) => {
        // console.log(res);

        if (res.length != 0) {
          for (let i = 0; i < res.length; i++) {
            const today = moment(new Date()).format('YYYY-MM-DD');
            const fromdate = moment(res[i].fromdate).format('YYYY-MM-DD');
            const todate = moment(res[i].todate).format('YYYY-MM-DD');
            // console.log(fromdate == todate);
            if (today == fromdate || today == todate) {
              this.checkin = true;
              this.checkout = true;
            } else if (fromdate == todate) {
              if (today == fromdate || today == todate) {
                this.checkin = true;
                this.checkout = true;
              } else {
                this.checkin = false;
                this.checkout = false;
              }
            } else {
              const dateArr = fromdate.split('-');
              const startdate = Number(fromdate.split('-')[2]);
              const enddate = Number(todate.split('-')[2]);

              for (let i = startdate; i <= enddate; i++) {
                // console.log(i);
                const today = moment(new Date()).format('YYYY-MM-DD');
                if (i <= 9) {
                  const leaveDate = dateArr[0] + '-' + dateArr[1] + '-0' + i;

                  if (today == leaveDate) {
                    this.checkin = true;
                    this.checkout = true;
                  } else {
                    this.checkin = false;
                    this.checkout = false;
                  }
                  // console.log(leaveDate);
                } else {
                  const leaveDate = dateArr[0] + '-' + dateArr[1] + '-' + i;

                  if (today == leaveDate) {
                    this.checkin = true;
                    this.checkout = true;
                  } else {
                    this.checkin = false;
                    this.checkout = false;
                  }
                  // console.log(leaveDate);
                }
              }
            }
          }
        } else {
          this.checkin = false;
          this.checkout = false;
        }
      },
      (err) => {
        console.log(err);
      }
    );

    this.staffService.checkInTableDetails().subscribe(async (res) => {
      const newRes = await res.filter((data) => {
        return data.empid == this.loggedInData.empid;
      });

      // console.log(res);

      const data = await newRes.filter((data) => {
        return (
          moment(new Date()).format('YYYY-MM-DD') ==
          moment(data.checkin).format('YYYY-MM-DD')
        );
      });

      // for (let checkin of res) {
      if (
        moment(data[0].checkin).format('YYYY-MM-DD') ==
          moment(new Date()).format('YYYY-MM-DD') &&
        data[0].checkin !== null
      ) {
        this.checkin = true;
      } else {
        this.checkin = false;
      }

      if (
        moment(data[0].checkout).format('YYYY-MM-DD') ==
          moment(new Date()).format('YYYY-MM-DD') &&
        data[0].checkout !== null
      ) {
        this.checkout = true;
      } else {
        this.checkout = false;
      }
      // }
    });

    this.staffService.getSalaryForStaff(this.loggedInData.empid).subscribe(
      (res) => {
        // console.log(res);
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
        // console.log(res);
        res = res.filter((data) => {
          return data.empid == this.loggedInData.empid;
        });

        // console.log(res);

        if (res.length <= 0) {
          this.staffService.checkIn({ empid }).subscribe(
            (res) => {
              if (res.present) {
                Swal.fire('Success!', 'Checked IN!', 'success');
                sessionStorage.setItem('checkInDetails', JSON.stringify(res));
                // this.ngOnInit();
                this.checkin = true;
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
                this.checkin = true;
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
                // this.ngOnInit();
                this.checkout = true;
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
                    // this.ngOnInit();
                    this.checkout = true;
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
