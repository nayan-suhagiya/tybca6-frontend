import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { StaffLeave } from './StaffLeave';
import { StaffService } from '../../services/staff.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-staff-leave',
  templateUrl: './staff-leave.component.html',
  styleUrls: ['../../admin/main.css'],
})
export class StaffLeaveComponent implements OnInit {
  dpart: string = 'Leave';
  @ViewChild('leaveForm') leaveForm: NgForm;
  loggedInData: any;
  leaveData: StaffLeave = new StaffLeave();
  pendingLeaveData: any;
  pendingLeaveDatalength: number;
  approvedOrdRejectedData: any;
  approvedOrdRejectedDatalength: number;
  date: string = new Date().toString();

  constructor(
    private staffService: StaffService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.loggedInData = this.staffService.loggednInData();

    this.staffService.getAppliedLeave(this.loggedInData.empid).subscribe(
      (res) => {
        // console.log(res);

        if (res.length !== 0) {
          this.pendingLeaveData = res.filter((data) => {
            return data.status == 'Pending';
          });

          this.approvedOrdRejectedData = res.filter((data) => {
            return data.status == 'Approved' || data.status == 'Rejected';
          });

          this.pendingLeaveDatalength = this.pendingLeaveData.length;
          this.approvedOrdRejectedDatalength =
            this.approvedOrdRejectedData.length;
        } else {
          this.pendingLeaveDatalength = 0;
          this.approvedOrdRejectedDatalength = 0;
        }
        this.spinner.hide();
      },
      (err) => {
        this.spinner.hide();
        console.log(err);
      }
    );
  }

  leaveFormSubmit() {
    if (this.leaveData.fromdate > this.leaveData.todate) {
      Swal.fire('Error!', 'Please select valid date!', 'error');
      return;
    }

    this.leaveData.fname = this.loggedInData.fname;
    this.leaveData.dname = this.loggedInData.dname;
    this.leaveData.empid = this.loggedInData.empid;
    this.leaveData.deptid = this.loggedInData.deptid;
    this.leaveData.status = 'Pending';
    this.leaveData.appliedOn = moment(new Date()).format('YYYY-MM-DD');
    // console.log(this.leaveData);
    // console.log(this.approvedOrdRejectedData);

    if (this.approvedOrdRejectedData !== undefined) {
      const filteredApprovedData = this.approvedOrdRejectedData.filter(
        (data) => {
          return (
            moment(this.leaveData.fromdate).format('YYYY-MM-DD') ==
            moment(data.fromdate).format('YYYY-MM-DD')
          );
        }
      );

      // console.log(filteredApprovedData);

      if (filteredApprovedData.length !== 0) {
        Swal.fire('Error!', 'You already applied leave for that day!', 'error');
      } else {
        this.staffService.applyLeave(this.leaveData).subscribe(
          (res) => {
            // console.log(res);

            if (res.offday) {
              Swal.fire('Warning!', 'There is off day!', 'warning');
              return;
            }

            if (res.added) {
              Swal.fire('Success!', 'Leave applied successfully!', 'success');
              this.leaveForm.reset();
              this.ngOnInit();
            } else {
              Swal.fire('Error!', 'Unable to applied leave!', 'error');
            }
          },
          (err) => {
            this.spinner.hide();
            console.log(err);
          }
        );
      }
    } else {
      this.staffService.applyLeave(this.leaveData).subscribe(
        (res) => {
          // console.log(res);

          if (res.offday) {
            Swal.fire('Warning!', 'There is off day!', 'warning');
            return;
          }

          if (res.added) {
            Swal.fire('Success!', 'Leave applied successfully!', 'success');
            this.leaveForm.reset();
            this.ngOnInit();
          } else {
            Swal.fire('Error!', 'Unable to applied leave!', 'error');
          }
        },
        (err) => {
          this.spinner.hide();
          console.log(err);
        }
      );
    }
  }

  deleteLeave(empid: string, fromdate: Date) {
    this.spinner.show();
    let eid = empid;
    let fdate = moment(fromdate).format('YYYY-MM-DD');

    // console.log(eid, fdate);
    this.staffService.deleteAppliedLeave(eid, fdate).subscribe(
      (res) => {
        console.log(res);

        if (res.deleted) {
          this.spinner.hide();
          Swal.fire(
            'Success!',
            'Applied leave deleted successfully!',
            'success'
          );
          this.ngOnInit();
        } else {
          this.spinner.hide();

          Swal.fire('Error!', 'Unable to delete!', 'error');
          this.ngOnInit();
        }
      },
      (err) => {
        this.spinner.hide();
        console.log(err);
        Swal.fire('Error!', 'Unable to delete!', 'error');
        this.ngOnInit();
      }
    );
  }
}
