import Swal from 'sweetalert2';
import { StaffService } from './../../services/staff.service';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css', '../../admin/admin.css'],
})
export class ProfileComponent implements OnInit {
  loggedInData: any;
  userdata: any;
  dpart: string = 'Profile';
  imageSrc: string = '';

  constructor(
    private staffService: StaffService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.loggedInData = this.staffService.loggednInData();
    this.loggedInData.dob = moment(this.loggedInData.dob).format('YYYY-MM-DD');
    this.loggedInData.jdate = moment(this.loggedInData.jdate).format(
      'YYYY-MM-DD'
    );
    this.imageSrc = this.loggedInData.profile;
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

  handleInputChange(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }

    var fileSize = Math.round(file.size / 1024);
    console.log(fileSize);

    if (fileSize <= 600) {
      // alert('Uploaded');
    } else {
      // alert('Error! File too large');
      Swal.fire(
        'Error',
        'File too large!Please upload Maximum 8kb size image!',
        'error'
      );
    }
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    this.imageSrc = reader.result;
    this.loggedInData.profile = this.imageSrc;
  }
}
