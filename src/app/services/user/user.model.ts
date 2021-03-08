import { Employee } from "../employee/employee.model";

export class User {
  oid?: number;
  user_name: string;
  password: string;
  permission: string;
  employee_oid: number;

  employee: Employee;

  constructor(obj?: any) {
    this.oid = obj && obj.oid || null;
    this.user_name = obj && obj.user_name || '';
    this.password = obj && obj.password || '';
    this.permission = obj && obj.permission || 'user';
    this.employee_oid = obj && obj.employee_oid || null;

    this.employee = obj && new Employee(obj.employee) || new Employee();
  }

}