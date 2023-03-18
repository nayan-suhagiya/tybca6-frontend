import { StaffComponent } from './components/staff/staff.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin/admin.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { AdminStaffComponent } from './admin/admin-staff/admin-staff.component';
import { AdminDepartmentComponent } from './admin/admin-department/admin-department.component';
import { SidebarComponent } from './admin/sidebar/sidebar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { SidebarStaffComponent } from './components/sidebar-staff/sidebar-staff.component';
import { HeaderComponent } from './admin/header/header.component';
import { HeaderStaffComponent } from './components/header-staff/header-staff.component';
import { StaffAttendanceComponent } from './components/staff-attendance/staff-attendance.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    LoginComponent,
    AdminStaffComponent,
    AdminDepartmentComponent,
    SidebarComponent,
    StaffComponent,
    SidebarStaffComponent,
    HeaderComponent,
    HeaderStaffComponent,
    StaffAttendanceComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    FullCalendarModule,
    NgxSpinnerModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
    BrowserAnimationsModule,
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
