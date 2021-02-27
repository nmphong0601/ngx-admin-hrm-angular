export class User {
  staffId?: number;
  userName: string;
  password: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  gender?: string;
  phone?: string;
  address?: string;
  email?: string;
  avatar?: string;

  constructor(obj?: any) {
    this.staffId = obj && obj.staffId || null,
    this.userName = obj && obj.userName || '',
    this.firstName = obj && obj.firstName || '',
    this.lastName = obj && obj.lastName || '',
    this.birthDate = obj && obj.birthDate || '',
    this.gender = obj && obj.gender || 'Male',
    this.phone = obj && obj.phone || '',
    this.address = obj && obj.address || '',
    this.email = obj && obj.email || '',
    this.avatar = obj && obj.avatar || ''
  }

}