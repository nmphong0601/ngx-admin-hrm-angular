import { Employee } from "../employee/employee.model";

export class Payroll {
  oid?: number;
  employee_id?: number;
  salary: number;
  bonus: number;
  personal_income_tax: number;//Thuế thu nhập cá nhân
  social_insurance: number;//Bảo hiểm xã hội
  health_insurance: number;//Bảo hiểm y tế
  absent_day: number;//Số ngày nghỉ (không phép)
  total_salary: number;//Tổng lương
  status: number;

  employee: Employee;

  constructor(obj?: any) {
    this.oid = obj && obj.oid || null,
    this.employee_id = obj && obj.employee_id || '',
    this.salary = obj && obj.salary || 0,
    this.bonus = obj && obj.bonus || 0,
    this.personal_income_tax = obj && obj.personal_income_tax || 0,
    this.social_insurance = obj && obj.salary*8/100 || 0,
    this.health_insurance = obj && obj.salary*1.5/100 || 0,
    this.absent_day = obj && obj.absent_day || 0,
    this.total_salary = obj && obj.total_salary || obj.salary - (obj.salary*obj.personal_income_tax/100) - this.social_insurance - this.health_insurance - (100000*obj.absent_day),
    this.status = obj && obj.status || 0,

    this.employee = obj && new Employee(obj.employee) || new Employee();
  }
}
