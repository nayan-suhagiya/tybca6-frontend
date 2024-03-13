import { AdminAttendanceComponent } from './admin/admin-attendance/admin-attendance.component';
import { StaffGuard } from './guard/staff.guard';
import { ProfileComponent } from './staff/profile/profile.component';
import { AdminLeaveComponent } from './admin/admin-leave/admin-leave.component';
import { StaffLeaveComponent } from './staff/staff-leave/staff-leave.component';
import { LeavedaysComponent } from './admin/leavedays/leavedays.component';
import { StaffAttendanceComponent } from './staff/staff-attendance/staff-attendance.component';
import { StaffComponent } from './staff/staff/staff.component';
import { AdminDepartmentComponent } from './admin/admin-department/admin-department.component';
import { AdminStaffComponent } from './admin/admin-staff/admin-staff.component';
import { AuthGuard } from './guard/auth.guard';
import { AdminComponent } from './admin/admin/admin.component';
import { LoginComponent } from './auth/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminSalaryComponent } from './admin/admin-salary/admin-salary.component';
import { StaffSalaryComponent } from './staff/staff-salary/staff-salary.component';
import { ForgotPasswordComponent } from './staff/forgot-password/forgot-password.component';
import { MyWorkComponent } from './staff/my-work/my-work.component';
import { StaffWorkComponent } from './admin/staff-work/staff-work.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/staff',
    component: AdminStaffComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/department',
    component: AdminDepartmentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/leavedays',
    component: LeavedaysComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/staffleave',
    component: AdminLeaveComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/attendance',
    component: AdminAttendanceComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/salary',
    component: AdminSalaryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/staff-work',
    component: StaffWorkComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'staff',
    component: StaffComponent,
    canActivate: [StaffGuard],
  },
  {
    path: 'staff/attendance',
    component: StaffAttendanceComponent,
    canActivate: [StaffGuard],
  },
  {
    path: 'staff/leave',
    component: StaffLeaveComponent,
    canActivate: [StaffGuard],
  },
  {
    path: 'staff/profile',
    component: ProfileComponent,
    canActivate: [StaffGuard],
  },
  {
    path: 'staff/salary',
    component: StaffSalaryComponent,
    canActivate: [StaffGuard],
  },
  {
    path: 'staff/my-work',
    component: MyWorkComponent,
    canActivate: [StaffGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
