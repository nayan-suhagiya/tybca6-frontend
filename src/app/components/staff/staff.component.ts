import { StaffService } from './../../services/staff.service';
import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css', '../../admin/admin.css'],
})
export class StaffComponent implements OnInit {
  loggedInData: any;
  // checkin: boolean = false;
  // checkout: boolean = false;

  constructor(
    private cookieService: CookieService,
    private staffService: StaffService
  ) {}

  ngOnInit(): void {
    this.loggedInData = this.staffService.loggednInData();
  }

  checkIn() {
    const empid = this.loggedInData.empid;

    this.staffService.checkInTableDetails().subscribe(
      (res) => {
        res = res.filter((data) => {
          return data.empid == this.loggedInData.empid;
        });
        // console.log(res);

        if (res.length <= 0) {
          this.staffService.checkIn({ empid }).subscribe(
            (res) => {
              // console.log(res);
              if (res.present) {
                // this.cookieService.set('isCheckedIn', 'true');
                alert('checked in!');
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
        } else {
          const today = moment(new Date()).format('YYYY-MM-DD');

          for (let checkin of res) {
            // console.log(checkin);
            if (today == moment(checkin.checkin).format('YYYY-MM-DD')) {
              alert('already checked in!');
            } else {
              this.staffService.checkIn({ empid }).subscribe(
                (res) => {
                  // console.log(res);
                  if (res.present) {
                    // this.cookieService.set('isCheckedIn', 'true');
                    alert('checked in!');
                    this.cookieService.set(
                      'checkInDetails',
                      JSON.stringify(res)
                    );
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
        // console.log(res);

        if (res.length <= 0) {
          this.staffService.checkOut({ empid }).subscribe(
            (res) => {
              // console.log(res);
              if (res.present == false) {
                // this.ngOnInit();
                alert('checked out!');
              } else {
                console.log('something went wrong!');
              }
            },
            (err) => {
              // console.log(err);
              alert('please first checkin!');
            }
          );
        } else {
          const today = moment(new Date()).format('YYYY-MM-DD');

          for (let checkin of res) {
            console.log(checkin);

            if (today == moment(checkin.checkout).format('YYYY-MM-DD')) {
              alert('already checked out!');
            } else {
              this.staffService.checkOut({ empid }).subscribe(
                (res) => {
                  // console.log(res);
                  if (res.present == false) {
                    // this.ngOnInit();
                    alert('checked out!');
                  } else {
                    console.log('something went wrong!');
                  }
                },
                (err) => {
                  // console.log(err);
                  alert('please first checkin!');
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

    /*
    this.staffService.checkOut({ empid }).subscribe(
      (res) => {
        // console.log(res);
        if (res.present == false) {
          // this.ngOnInit();
        } else {
          alert('something went wrong!');
        }
      },
      (err) => {
        console.log(err);
      }
    );
    */
  }
}
