import { NgModule } from '@angular/core';
import {
  NbActionsModule,
  NbLayoutModule,
  NbMenuModule,
  NbSearchModule,
  NbSidebarModule,
  NbUserModule,
  NbContextMenuModule,
  NbButtonModule,
  NbSelectModule,
  NbIconModule,
  NbThemeModule,
  NbCardModule,
  NbAlertModule,
  NbInputModule,
  NbSpinnerModule,
} from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ThemeModule } from '../@theme/theme.module';
import { AuthenticationComponent } from './authentication.component';
import { PagesRoutingModule } from './authentication-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { DialogOTPPromptComponent } from './dialog-otp-prompt/dialog-otp-prompt.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbSpinnerModule,
    NbActionsModule,
    NbLayoutModule,
    NbMenuModule,
    NbSearchModule,
    NbSidebarModule,
    NbUserModule,
    NbContextMenuModule,
    NbButtonModule,
    NbSelectModule,
    NbIconModule,
    NbThemeModule,
    NbCardModule,
    NbAlertModule,
    FormsModule,
    ReactiveFormsModule,
    MiscellaneousModule,
    NbInputModule
  ],
  declarations: [
    AuthenticationComponent,
    LoginComponent,
    ChangePasswordComponent,
    ForgotPasswordComponent,
    DialogOTPPromptComponent
  ],
})
export class AuthenticationModule {
}
