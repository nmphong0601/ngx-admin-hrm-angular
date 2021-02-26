import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { HrmPagesComponent } from './hrm-pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { HrmPagesRoutingModule } from './hrm-pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';

@NgModule({
  imports: [
    HrmPagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    ECommerceModule,
    MiscellaneousModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    HrmPagesComponent,
  ],
})
export class HrmPagesModule {
}
