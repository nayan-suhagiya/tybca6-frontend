import { StaffLeave } from './StaffLeave';
import { StaffService } from './../../services/staff.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-staff-leave',
  templateUrl: './staff-leave.component.html',
  styleUrls: ['./staff-leave.component.css', '../../admin/admin.css'],
})
export class StaffLeaveComponent implements OnInit {
  loggedInData: any;
  leaveData: StaffLeave = new StaffLeave();

  constructor(private staffService: StaffService) {}

  ngOnInit(): void {
    this.loggedInData = this.staffService.loggednInData();
  }

  leaveFormSubmit() {
    console.log(this.leaveData);
  }
}
