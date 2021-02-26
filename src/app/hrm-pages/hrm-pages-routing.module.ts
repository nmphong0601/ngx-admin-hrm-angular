import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { HrmPagesComponent } from './hrm-pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeeListComponent } from './employee/employee-list/employee-list.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';

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
      component: EmployeeListComponent,
    },
    {
      path: '',
      redirectTo: 'hrm-dashboard',
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
