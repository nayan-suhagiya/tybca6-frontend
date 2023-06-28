import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, Input, Inject, OnInit, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { StaffService } from 'src/app/services/staff.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['../main.css'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('adminUpdatePasswdForm') adminUpdatePasswdForm: NgForm;
  @Input() part = '';
  elem: any;
  isFullScreen: boolean = false;
  updatedPassword: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(DOCUMENT) private document: any,
    private spinner: NgxSpinnerService,
    private staffServie: StaffService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAdminLogin()) {
      this.router.navigate(['/login']);
      return;
    }

    this.chkScreenMode();
    this.elem = document.documentElement;
  }

  fullscreenmodes(event) {
    this.chkScreenMode();
  }
  chkScreenMode() {
    if (document.fullscreenElement) {
      //fullscreen
      this.isFullScreen = true;
    } else {
      //not in full screen
      this.isFullScreen = false;
    }
  }

  isLogin() {
    return this.authService.isAdminLogin();
  }

  logOut() {
    const adminToken = sessionStorage.getItem('authToken');
    if (!adminToken) {
      const userAuthToken = sessionStorage.getItem('userAuthToken');
      this.callLogOut(userAuthToken);
    } else {
      this.callLogOut(adminToken);
    }
  }

  callLogOut(token: string) {
    this.spinner.show();
    this.authService.logout(token).subscribe(
      (res) => {
        sessionStorage.clear();
        this.spinner.hide();
        this.router.navigate(['/login']);
      },
      (err) => {
        this.spinner.hide();
        // Swal.fire('Error!', 'Unnable to logout!', 'error');
      }
    );
  }

  openFullscreen() {
    this.isFullScreen = true;
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
  }

  closeFullscreen() {
    this.isFullScreen = false;
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }
  }

  updatePassword() {
    // console.log(this.updatedPassword);
    this.staffServie
      .updateAdminPassword({ password: this.updatedPassword })
      .subscribe(
        (res) => {
          if (res.updated) {
            Swal.fire('Success!', 'Password updated!', 'success');
          } else {
            Swal.fire('Error!', 'Unable to change password!', 'error');
          }
        },
        (err) => {
          console.log(err);
          Swal.fire('Error!', 'Unable to change password!', 'error');
        }
      );
  }

  resetForm() {
    this.adminUpdatePasswdForm.reset();
  }
}
