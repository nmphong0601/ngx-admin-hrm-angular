import { Employee } from "../employee/employee.model";

export class User {
  oid?: number;
  userName: string;
  password: string;

  employee: Employee;

  constructor(obj?: any) {
    this.oid = obj && obj.oid || null,
    this.userName = obj && obj.userName || '',
    this.password = obj && obj.password || '',

    this.employee = obj && new Employee(obj.employee) || new Employee();
  }

}