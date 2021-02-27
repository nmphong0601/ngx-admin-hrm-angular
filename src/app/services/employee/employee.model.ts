import { JobRole } from "../job-role/job-role.model";

export class Employee {
  oid?: number;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  gender?: string;
  phone?: string;
  address?: string;
  email?: string;
  avatar?: string;

  jobRole: JobRole;

  constructor(obj?: any) {
    this.oid = obj && obj.oid || null,
    this.firstName = obj && obj.firstName || '',
    this.lastName = obj && obj.lastName || '',
    this.birthDate = obj && obj.birthDate || '',
    this.gender = obj && obj.gender || 'Male',
    this.phone = obj && obj.phone || '',
    this.address = obj && obj.address || '',
    this.email = obj && obj.email || '',
    this.avatar = obj && obj.avatar || ''

    this.jobRole = obj && new JobRole(obj.jobRole) || new JobRole();
  }

}
