import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { 
  NbAlertModule, 
  NbButtonModule, 
  NbCardModule, 
  NbDatepickerModule, 
  NbIconModule, 
  NbInputModule, 
  NbMenuModule, 
  NbRadioModule, 
  NbSpinnerModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { HrmPagesComponent } from './hrm-pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { HrmPagesRoutingModule } from './hrm-pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DialogEmployeePromptComponent } from './employee/dialog-employee-prompt/dialog-employee-prompt.component';
import { EmployeeComponent } from './employee/employee.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PayrollComponent } from './payroll/payroll.component';
import { DialogPayrollPromptComponent } from './payroll/dialog-payroll-prompt/dialog-payroll-prompt.component';

@NgModule({
  entryComponents: [DialogPayrollPromptComponent, DialogEmployeePromptComponent],
  imports: [
    NbIconModule,
    NbInputModule,
    NbButtonModule,
    NbCardModule,
    NbRadioModule,
    FormsModule,
    ReactiveFormsModule,
    HrmPagesRoutingModule,
    NbAlertModule,
    NbSpinnerModule,
    ThemeModule,
    NbMenuModule,
    Ng2SmartTableModule,
    NbDatepickerModule.forRoot(),
    DashboardModule,
    MiscellaneousModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [//Nếu Component không có Module riêng thì phải declare trong Module cha cấp gần nhất
    HrmPagesComponent,
    EmployeeComponent,
    DialogEmployeePromptComponent,
    PayrollComponent,
    DialogPayrollPromptComponent
  ],
})
export class HrmPagesModule {
}
