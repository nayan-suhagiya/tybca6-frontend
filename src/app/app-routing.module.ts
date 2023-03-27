import { AdminLeaveComponent } from './admin/admin-leave/admin-leave.component';
import { StaffLeaveComponent } from './components/staff-leave/staff-leave.component';
import { LeavedaysComponent } from './admin/leavedays/leavedays.component';
import { StaffAttendanceComponent } from './components/staff-attendance/staff-attendance.component';
import { StaffComponent } from './components/staff/staff.component';
import { AdminDepartmentComponent } from './admin/admin-department/admin-department.component';
import { AdminStaffComponent } from './admin/admin-staff/admin-staff.component';
import { AuthGuard } from './guard/auth.guard';
import { AdminComponent } from './admin/admin/admin.component';
import { LoginComponent } from './components/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
    path: 'staff',
    component: StaffComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'staff/attendance',
    component: StaffAttendanceComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'staff/leave',
    component: StaffLeaveComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
