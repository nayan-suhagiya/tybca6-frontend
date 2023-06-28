import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { Component, Inject, Input, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header-staff',
  templateUrl: './header-staff.component.html',
  styleUrls: ['./header-staff.component.css', '../../admin/admin.css'],
})
export class HeaderStaffComponent implements OnInit {
  @Input() loggedInData: any;
  @Input() dpart: any;
  elem: any;
  isFullScreen: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(DOCUMENT) private document: any,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isStaffLogin()) {
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

  @HostListener('document:fullscreenchange', ['$event'])
  @HostListener('document:webkitfullscreenchange', ['$event'])
  @HostListener('document:mozfullscreenchange', ['$event'])
  @HostListener('document:MSFullscreenChange', ['$event'])
  isLogin() {
    return this.authService.isStaffLogin();
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
        // Swal.fire('Error!', 'Unable to logout!', 'error');
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
}
