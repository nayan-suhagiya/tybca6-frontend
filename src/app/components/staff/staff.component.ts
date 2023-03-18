import { StaffService } from './../../services/staff.service';
import { CookieService } from 'ngx-cookie-service';
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
  checkin;
  checkout;
  date: string = new Date().toString();

  constructor(
    private cookieService: CookieService,
    private staffService: StaffService
  ) {}

  ngOnInit(): void {
    setInterval(() => {
      this.date = new Date().toString();
    }, 1000);
    this.loggedInData = this.staffService.loggednInData();

    this.staffService.checkInTableDetails().subscribe((res) => {
      res = res.filter((data) => {
        return data.empid == this.loggedInData.empid;
      });

      for (let checkin of res) {
        if (
          checkin.checkin !== null &&
          moment(checkin.checkin).format('YYYY-MM-DD') ==
            moment(new Date()).format('YYYY-MM-DD')
        ) {
          this.checkin = true;
        } else {
          this.checkin = false;
        }

        if (
          checkin.checkout !== null &&
          moment(checkin.checkin).format('YYYY-MM-DD') ==
            moment(new Date()).format('YYYY-MM-DD')
        ) {
          this.checkout = true;
        } else {
          this.checkout = false;
        }
      }
    });
  }

  checkIn() {
    const empid = this.loggedInData.empid;

    this.staffService.checkInTableDetails().subscribe(
      (res) => {
        res = res.filter((data) => {
          return data.empid == this.loggedInData.empid;
        });

        if (res.length <= 0) {
          this.staffService.checkIn({ empid }).subscribe(
            (res) => {
              if (res.present) {
                Swal.fire('Success!', 'Checked IN!', 'success');
                this.cookieService.set('checkInDetails', JSON.stringify(res));
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
          const today = moment(new Date()).format('YYYY-MM-DD');

          for (let checkin of res) {
            if (today == moment(checkin.checkin).format('YYYY-MM-DD')) {
              Swal.fire('Warning!', 'Already checked in!', 'warning');
            } else {
              this.staffService.checkIn({ empid }).subscribe(
                (res) => {
                  if (res.present) {
                    Swal.fire('Success!', 'Checked IN!', 'success');
                    this.cookieService.set(
                      'checkInDetails',
                      JSON.stringify(res)
                    );
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
          }
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  checkOut() {
    const empid = this.loggedInData.empid;

    this.staffService.checkInTableDetails().subscribe(
      (res) => {
        res = res.filter((data) => {
          return data.empid == this.loggedInData.empid;
        });

        if (res.length <= 0) {
          this.staffService.checkOut({ empid }).subscribe(
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
              this.staffService.checkOut({ empid }).subscribe(
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
