import { Work } from './Work';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { StaffService } from 'src/app/services/staff.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-work',
  templateUrl: './my-work.component.html',
  styleUrls: ['./my-work.component.css', '../../admin/main.css'],
})
export class MyWorkComponent implements OnInit {
  @ViewChild('workForm') workForm: NgForm;
  loggedInData: any;
  dpart: string = 'My Work';
  workData: Work = new Work();
  todayData: any = [];
  todaydataLength: number = 0;
  searchData: any = [];
  searchdataLength: number = 0;
  today: any;

  constructor(
    private staffService: StaffService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.loggedInData = this.staffService.loggednInData();
    this.today = moment(new Date()).format('YYYY-MM-DD');

    this.spinner.show(); // Show spinner during initial loading

    this.staffService.getWorkDetails(this.loggedInData.empid).subscribe(
      (res) => {
        if (res.length !== 0) {
          this.todayData = res.filter((data) => {
            return this.today == moment(data.date).format('YYYY-MM-DD');
          });

          this.todaydataLength = this.todayData.length;
        } else {
          this.todaydataLength = 0;
        }
      },
      (err) => {
        console.log(err);
      },
      () => {
        this.spinner.hide(); // Hide spinner after API call completes
      }
    );
  }

  workDetailSubmit() {
    this.spinner.show();

    this.workData.date = moment(new Date()).format('YYYY-MM-DD');
    this.workData.empid = this.loggedInData.empid;

    this.staffService.addWorkDetails(this.workData).subscribe(
      (res) => {
        if (res.inserted) {
          this.spinner.hide();
          this.workForm.reset();
          Swal.fire('Success!', 'Work details added!', 'success');
          this.ngOnInit();
        } else {
          this.spinner.hide();
          Swal.fire('Error!', 'Unable to add!', 'error');
        }
      },
      (err) => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  searchWorkDetails(event) {
    this.spinner.show();

    const searchDate = event.target.value;

    if (searchDate == '') {
      this.searchdataLength = 0;
      this.spinner.hide();
      return;
    }

    if (searchDate > this.today) {
      this.spinner.hide();
      Swal.fire('Error!', 'Please select a valid date!', 'error');
      return;
    }

    this.staffService
      .getWorkDetailsUsingDate(this.loggedInData.empid, searchDate)
      .subscribe(
        (res) => {
          if (res.length !== 0) {
            this.spinner.hide();
            this.searchData = res;
            this.searchdataLength = res.length;
          } else {
            this.spinner.hide();
            this.searchdataLength = 0;
          }
        },
        (err) => {
          this.spinner.hide();
          console.log(err);
        }
      );
  }
}
