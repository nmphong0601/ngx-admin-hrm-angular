import { Department } from "../department/department.model";
import { JobRole } from "../job-role/job-role.model";
import { User } from "../user/user.model";

export class Employee {
  oid?: number;
  first_name?: string;
  last_name?: string;
  birth_date?: string;
  gender?: string;
  phone?: string;
  address?: string;
  email?: string;
  avatar?: string;

  user: User;
  jobRole: JobRole;
  department: Department;

  constructor(obj?: any) {
    this.oid = obj && obj.oid || null,
    this.first_name = obj && obj.first_name || '',
    this.last_name = obj && obj.last_name || '',
    this.birth_date = obj && obj.birth_date || '',
    this.gender = obj && obj.gender || 'Nam',
    this.phone = obj && obj.phone || '',
    this.address = obj && obj.address || '',
    this.email = obj && obj.email || '',
    this.avatar = obj && obj.avatar || ''

    this.jobRole = obj && new JobRole(obj.jobRole) || new JobRole();
    this.department = obj && new Department(obj.department) || new Department();
    this.user = obj && new User(obj.user) || new User();
  }

}
