import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginComponent } from 'src/app/auth/login/login.component';
import { StaffService } from 'src/app/services/staff.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../../auth/login.css'],
})
export class ForgotPasswordComponent implements OnInit {
  staffID: string;
  @ViewChild('forgotForm') forgotForm: NgForm;

  constructor(
    private staffService: StaffService,
    private spinner: NgxSpinnerService
  ) {}
  ngOnInit(): void {}

  sendForgotPasswdMail() {
    // console.log(this.staffID);
    this.spinner.show();
    this.staffService.sendForgotPasswordMail({ empid: this.staffID }).subscribe(
      (res: any) => {
        if (res.userFound) {
          Swal.fire(
            'Success!',
            'Your password sent to your registered email!',
            'success'
          );
          this.spinner.hide();
        } else {
          Swal.fire('Error!', 'Please enter valid staffID or empID!', 'error');
          this.spinner.hide();
        }
      },
      (err) => {
        console.log(err);
      }
    );
    this.forgotForm.reset();
  }
}
