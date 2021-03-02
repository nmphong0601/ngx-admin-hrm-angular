import { Employee } from "../employee/employee.model";

export class Payroll {
  oid?: number;
  employee_id?: number;
  salary: string;
  bonus: string;
  personal_income_tax: string;
  status: number;

  employee: Employee;

  constructor(obj?: any) {
    this.oid = obj && obj.oid || null,
    this.employee_id = obj && obj.userName || '',
    this.salary = obj && obj.lastName || '',
    this.bonus = obj && obj.birthDate || '',
    this.personal_income_tax = obj && obj.personal_income_tax || '',
    this.status = obj && obj.status || 0,

    this.employee = obj && new Employee(obj.employee) || new Employee();
  }
}
