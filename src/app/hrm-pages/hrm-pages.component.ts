import { Component } from '@angular/core';

import { MENU_ITEMS } from './hrm-pages-menu';

@Component({
  selector: 'ngx-hrm-pages',
  styleUrls: ['hrm-pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class HrmPagesComponent {
  role: string;
  menu = MENU_ITEMS;
}
