import { Component, Input } from '@angular/core';

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

@Component({
  selector: 'ngx-fs-icon',
  template: `
    <nb-tree-grid-row-toggle
      [expanded]="expanded"
      *ngIf="isDir(); else fileIcon"
    >
    </nb-tree-grid-row-toggle>
    <ng-template #fileIcon>
      <nb-icon icon="corner-down-right"></nb-icon>
    </ng-template>
  `
})
export class FsIconComponent {
  @Input() kind: string;
  @Input() expanded: boolean;

  isDir(): boolean {
    return this.kind !== null;
  }
}
