import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { HeaderStaffComponent } from './header-staff/header-staff.component';
import { MyWorkComponent } from './my-work/my-work.component';
import { ProfileComponent } from './profile/profile.component';
import { SidebarStaffComponent } from './sidebar-staff/sidebar-staff.component';
import { StaffComponent } from './staff/staff.component';
import { StaffAttendanceComponent } from './staff-attendance/staff-attendance.component';
import { StaffLeaveComponent } from './staff-leave/staff-leave.component';
import { StaffSalaryComponent } from './staff-salary/staff-salary.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AppRoutingModule } from '../app-routing.module';

import { StaffService } from '../services/staff.service';
import { AuthService } from '../services/auth.service';

@NgModule({
  declarations: [
    ForgotPasswordComponent,
    HeaderStaffComponent,
    MyWorkComponent,
    ProfileComponent,
    SidebarStaffComponent,
    StaffComponent,
    StaffAttendanceComponent,
    StaffLeaveComponent,
    StaffSalaryComponent,
    HeaderStaffComponent,
  ],
  imports: [CommonModule, FormsModule, FullCalendarModule, AppRoutingModule],
  exports: [
    ForgotPasswordComponent,
    HeaderStaffComponent,
    MyWorkComponent,
    ProfileComponent,
    SidebarStaffComponent,
    StaffComponent,
    StaffAttendanceComponent,
    StaffLeaveComponent,
    StaffSalaryComponent,
    HeaderStaffComponent,
  ],
  providers: [StaffService, AuthService],
})
export class StaffModule {}
