import { StaffService } from './../../services/staff.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css', '../../admin/admin.css'],
})
export class ProfileComponent implements OnInit {
  loggedInData: any;

  constructor(private staffService: StaffService) {}

  ngOnInit(): void {
    this.loggedInData = this.staffService.loggednInData();
    // console.log(this.loggedInData);
  }
}
