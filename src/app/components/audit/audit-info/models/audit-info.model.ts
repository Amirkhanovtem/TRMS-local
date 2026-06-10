import { AuditModel } from '@components/audit/audit/models/audit.model';

export class AuditInfoModel {
  public colName: string;
  public valueOld: string;
  public valueNew: string;
  public audit: AuditModel;
}
