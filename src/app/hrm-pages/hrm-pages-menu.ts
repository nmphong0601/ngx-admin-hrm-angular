import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'home-outline',
    link: '/app/hrm-dashboard',
    home: true,
  },
  {
    title: 'QUẢN TRỊ',
    group: true,
  },
  {
    title: 'Quản lý nhân viên',
    icon: 'person-outline',
    link: '/app/employee'
  },
  {
    title: 'Quản lý lương',
    icon: 'credit-card-outline',
    link: '/app/payroll'
  },
];
