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
    path: 'staff',
    component: StaffComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
