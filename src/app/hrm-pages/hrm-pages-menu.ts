import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'home-outline',
    link: '/app/hrm-dashboard',
    home: true,
  },
  {
    title: 'ADMIN',
    group: true,
  },
  {
    title: 'Employee',
    icon: 'person-outline',
    link: '/app/employee'
  },
];
