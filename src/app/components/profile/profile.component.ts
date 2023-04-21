import Swal from 'sweetalert2';
import { StaffService } from './../../services/staff.service';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css', '../../admin/admin.css'],
})
export class ProfileComponent implements OnInit {
  loggedInData: any;
  userdata: any;
  dpart: string = 'Profile';

  constructor(
    private staffService: StaffService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.loggedInData = this.staffService.loggednInData();
  }

  updateProfile() {
    this.spinner.show();
    this.loggedInData.password = this.generatePassword(
      this.loggedInData.email,
      this.loggedInData.mobile
    );
    this.staffService.updateProfile(this.loggedInData).subscribe(
      (res) => {
        if (res.updated) {
          sessionStorage.setItem(
            'loggedInData',
            JSON.stringify(this.loggedInData)
          );
          Swal.fire('Success!', 'Your Profile Updated!', 'success');
          this.spinner.hide();
          this.ngOnInit();
        }
      },
      (err) => {
        Swal.fire('Oops!', 'Unable to update!', 'error');
        this.spinner.hide();
      }
    );
  }

  generatePassword(email: string, mobile: string) {
    const password = email.substring(0, 3) + mobile.substring(5);
    return password.toUpperCase();
  }
}
