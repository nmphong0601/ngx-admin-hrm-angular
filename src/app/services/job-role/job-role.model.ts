export class JobRole {
  oid?: number;
  name: string;

  constructor(obj?: any) {
    this.oid = obj && obj.oid || null,
    this.name = obj && obj.name || ''
  }
}
