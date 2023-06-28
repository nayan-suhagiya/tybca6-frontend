import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminComponent } from './admin/admin.component';
import { AdminAttendanceComponent } from './admin-attendance/admin-attendance.component';
import { AdminDepartmentComponent } from './admin-department/admin-department.component';
import { AdminLeaveComponent } from './admin-leave/admin-leave.component';
import { AdminSalaryComponent } from './admin-salary/admin-salary.component';
import { AdminStaffComponent } from './admin-staff/admin-staff.component';
import { HeaderComponent } from './header/header.component';
import { LeavedaysComponent } from './leavedays/leavedays.component';
import { SidebarComponent } from './sidebar/sidebar.component';

import { StaffService } from '../services/staff.service';
import { DeptService } from '../services/dept.service';
import { AuthService } from '../services/auth.service';

import { FullCalendarModule } from '@fullcalendar/angular';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import { StaffWorkComponent } from './staff-work/staff-work.component';

@NgModule({
  declarations: [
    AdminComponent,
    AdminAttendanceComponent,
    AdminDepartmentComponent,
    AdminLeaveComponent,
    AdminSalaryComponent,
    AdminStaffComponent,
    HeaderComponent,
    LeavedaysComponent,
    SidebarComponent,
    StaffWorkComponent,
  ],
  imports: [CommonModule, FullCalendarModule, FormsModule, AppRoutingModule],
  exports: [
    AdminComponent,
    AdminAttendanceComponent,
    AdminDepartmentComponent,
    AdminLeaveComponent,
    AdminSalaryComponent,
    AdminStaffComponent,
    HeaderComponent,
    LeavedaysComponent,
    SidebarComponent,
    StaffWorkComponent,
  ],
  providers: [StaffService, DeptService, AuthService],
})
export class AdminModule {}
