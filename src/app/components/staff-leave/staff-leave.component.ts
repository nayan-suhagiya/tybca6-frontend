import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { StaffLeave } from './StaffLeave';
import { StaffService } from './../../services/staff.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-staff-leave',
  templateUrl: './staff-leave.component.html',
  styleUrls: ['../../admin/admin.css'],
})
export class StaffLeaveComponent implements OnInit {
  @ViewChild('leaveForm') leaveForm: NgForm;
  loggedInData: any;
  leaveData: StaffLeave = new StaffLeave();
  pendingLeaveData: any;
  pendingLeaveDatalength: number;
  approvedOrdRejectedData: any;
  approvedOrdRejectedDatalength: number;
  date: string = new Date().toString();
  offDay: boolean = false;

  constructor(private staffService: StaffService) {}

  ngOnInit(): void {
    const today = new Date();

    const day = this.date.split(' ')[0];

    if (day == 'Sat' || day == 'Sun') {
      this.offDay = true;
    }

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
      },
      (err) => {
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
        console.log(err);
      }
    );
  }
}
