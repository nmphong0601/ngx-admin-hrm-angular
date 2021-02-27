import { Employee } from "../employee/employee.model";

export class Payroll {
  oid?: number;
  employeeId?: number;
  salary: string;
  bonus: string;
  status: string;

  employee: Employee;

  constructor(obj?: any) {
    this.oid = obj && obj.oid || null,
    this.employeeId = obj && obj.userName || '',
    this.salary = obj && obj.lastName || '',
    this.bonus = obj && obj.birthDate || '',
    this.status = obj && obj.gender || 'Male',

    this.employee = obj && new Employee(obj.employee) || new Employee();
  }
}
