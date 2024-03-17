import Swal from 'sweetalert2';
import { StaffService } from './../../services/staff.service';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

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

  constructor(
    private staffService: StaffService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData() {
    this.spinner.show();

    this.staffService.getPendingLeave().subscribe(
      (res) => {
        // console.log(res);

        this.pendingLeaveData = res;
        this.pendingLeaveDatalength = this.pendingLeaveData.length;
      },
      (err) => {
        console.log(err);
        this.spinner.hide();
      }
    );

    this.staffService.getApproveOrRejectLeave().subscribe(
      (res) => {
        // console.log(res);

        this.approveOrRejectData = res;
        this.approveOrRejectDatalength = this.approveOrRejectData.length;
        this.spinner.hide();
      },
      (err) => {
        console.log(err);
        this.spinner.hide();
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
          this.loadInitialData();
          this.spinner.hide();
        }
      },
      (err) => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  rejectClick(data: any) {
    this.spinner.show();

    const empid = data.empid;
    const fromdate = data.fromdate;

    this.staffService.rejectLeave({ empid, fromdate }).subscribe(
      (res) => {
        if (!res.approved) {
          Swal.fire('Warning!', 'Leave Rejected!', 'warning');
          this.loadInitialData();
          this.spinner.hide();
        }
      },
      (err) => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }
}
