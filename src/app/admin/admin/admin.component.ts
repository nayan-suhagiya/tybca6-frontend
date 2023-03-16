import { StaffService } from './../../services/staff.service';
import { DeptService } from './../../services/dept.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['../admin.css'],
})
export class AdminComponent implements OnInit {
  totalDept: number;
  totalStaffMemeber: number;
  dpart = 'Dashboard';

  constructor(
    private deptService: DeptService,
    private staffService: StaffService
  ) {}

  ngOnInit(): void {
    this.deptService.getDepartments().subscribe(
      (res) => {
        this.totalDept = res.length;
      },
      (err) => {
        console.log(err);
      }
    );

    this.staffService.getStaff().subscribe(
      (res) => {
        this.totalStaffMemeber = res.length;
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
