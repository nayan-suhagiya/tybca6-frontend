import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { StaffService } from 'src/app/services/staff.service';
import { NgxSpinnerService } from 'ngx-spinner'; // Import NgxSpinnerService

@Component({
  selector: 'app-staff-work',
  templateUrl: './staff-work.component.html',
  styleUrls: ['./staff-work.component.css', '../main.css'],
})
export class StaffWorkComponent implements OnInit {
  dpart: string = 'Staff-Work';
  workdDataLength: number = 0;
  workData: any;
  today: string;

  constructor(
    private staffService: StaffService,
    private spinner: NgxSpinnerService // Inject NgxSpinnerService
  ) {}

  ngOnInit(): void {
    const date = new Date().toISOString();
    this.today = moment(date).format('YYYY-MM-DD');

    this.callApi(date);
  }

  searchDetails(event) {
    console.log(event.target.value);

    let date = event.target.value;

    if (date == '') {
      this.workdDataLength = 0;
      return;
    }

    this.callApi(date);
  }

  callApi = (date) => {
    this.spinner.show(); // Show spinner
    this.staffService.getStaffWorkDetails(date).subscribe(
      (res: any) => {
        if (res.length != 0) {
          this.workdDataLength = res.length;
          this.workData = res;
          this.spinner.hide();
        } else {
          this.workData = res;
          this.workdDataLength = res.length;
          this.spinner.hide();
        }
      },
      (err) => {
        console.log(err);
        this.spinner.hide(); // Hide spinner in case of error
      }
    );
  };
}
