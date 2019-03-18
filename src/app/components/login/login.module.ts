import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatDialogModule } from '@angular/material';
import { MatSharedModule } from '@shared';

import { LoginComponent } from './login.component';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';

@NgModule({
  declarations: [
    LoginComponent,
    LoginDialogComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatSharedModule,
  ],
  entryComponents: [
    LoginDialogComponent
  ],
  exports: [ LoginComponent ],
})
export class LoginModule { }
