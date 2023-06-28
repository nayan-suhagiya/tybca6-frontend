import Swal from 'sweetalert2';
import { StaffService } from './../../services/staff.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-leave',
  templateUrl: './admin-leave.component.html',
  styleUrls: ['../main.css'],
})
export class AdminLeaveComponent implements OnInit {
  dpart: string = 'Leave Manage';
  pendingLeaveData: any;
  pendingLeaveDatalength: number;
  approveOrRejectData: any;
  approveOrRejectDatalength: number;

  constructor(private staffService: StaffService) {}

  ngOnInit(): void {
    this.staffService.getPendingLeave().subscribe(
      (res) => {
        // console.log(res);

        this.pendingLeaveData = res;
        this.pendingLeaveDatalength = this.pendingLeaveData.length;
      },
      (err) => {
        console.log(err);
      }
    );

    this.staffService.getApproveOrRejectLeave().subscribe(
      (res) => {
        // console.log(res);

        this.approveOrRejectData = res;
        this.approveOrRejectDatalength = this.approveOrRejectData.length;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  approveClick(data: any) {
    // console.log(data);
    const empid = data.empid;
    const fromdate = data.fromdate;
    // console.log('approved clicked!');
    this.staffService.approveLeave({ empid, fromdate }).subscribe(
      (res) => {
        // console.log(res);

        if (res.approved) {
          Swal.fire('Success!', 'Leave Approved!', 'success');
          this.ngOnInit();
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  rejectClick(data: any) {
    // console.log(data);
    const empid = data.empid;
    const fromdate = data.fromdate;
    // console.log('reject clicked!');
    this.staffService.rejectLeave({ empid, fromdate }).subscribe(
      (res) => {
        // console.log(res);

        if (res.rejected) {
          Swal.fire('Warning!', 'Leave Rejected!', 'warning');
          this.ngOnInit();
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
