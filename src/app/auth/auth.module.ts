import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from '../app-routing.module';

import { AuthService } from '../services/auth.service';

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, FormsModule, AppRoutingModule],
  exports: [LoginComponent],
  providers: [AuthService],
})
export class AuthModule {}
