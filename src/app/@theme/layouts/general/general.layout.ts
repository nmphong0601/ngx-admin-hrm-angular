import { Component } from '@angular/core';

@Component({
  selector: 'ngx-general-layout',
  styleUrls: ['./general.layout.scss'],
  template: `
    <nb-layout windowMode>
      <nb-layout-column>
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>
    </nb-layout>
  `,
})
export class GeneralLayoutComponent {}
