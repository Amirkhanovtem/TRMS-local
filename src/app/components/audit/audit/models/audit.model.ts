import { AuditInfoModel } from '@components/audit/audit-info/models/audit-info.model';

export class AuditModel {
  public id: string;
  public author: string;
  public srcTable: string;
  public version: number;
  public timestamp: Date;
  public action: number;
  public auditInfos: Array<AuditInfoModel>;
}
