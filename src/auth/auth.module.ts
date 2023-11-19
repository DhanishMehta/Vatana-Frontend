import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from 'src/shared/shared.module';
import { AuthLoginComponent } from './login/login.component';
import { AuthRegisterComponent } from './register/register.component';
import { LogoutComponent } from './logout/logout.component';


@NgModule({
  declarations: [
    AuthLoginComponent,
    AuthRegisterComponent,
    LogoutComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule
  ],
  exports: [
    AuthLoginComponent,
    AuthRegisterComponent
  ]
})
export class AuthModule { }
