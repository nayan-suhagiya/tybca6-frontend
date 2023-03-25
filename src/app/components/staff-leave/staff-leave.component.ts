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
  allLeaveData: any;

  constructor(private staffService: StaffService) {}

  ngOnInit(): void {
    this.loggedInData = this.staffService.loggednInData();

    this.staffService.getAppliedLeave(this.loggedInData.empid).subscribe(
      (res) => {
        // console.log(res);

        if (res.length == 0) {
        } else {
          // console.log(res);
          this.allLeaveData = res;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  leaveFormSubmit() {
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
