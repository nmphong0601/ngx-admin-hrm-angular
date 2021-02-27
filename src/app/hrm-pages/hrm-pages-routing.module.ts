import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { HrmPagesComponent } from './hrm-pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeeComponent } from './employee/employee.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { PayrollComponent } from './payroll/payroll.component';

const routes: Routes = [{
  path: '',
  component: HrmPagesComponent,
  children: [
    {
      path: 'hrm-dashboard',
      component: DashboardComponent,
    },
    {
      path: 'employee',
      component: EmployeeComponent,
    },
    {
      path: 'payroll',
      component: PayrollComponent,
    },
    {
      path: '',
      redirectTo: 'employee',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HrmPagesRoutingModule {
}
