import { Employee } from "../employee/employee.model";

export class User {
  oid?: number;
  user_name: string;
  password: string;

  employee: Employee;

  constructor(obj?: any) {
    this.oid = obj && obj.oid || null,
    this.user_name = obj && obj.user_name || '',
    this.password = obj && obj.password || '',

    this.employee = obj && new Employee(obj.employee) || new Employee();
  }

}