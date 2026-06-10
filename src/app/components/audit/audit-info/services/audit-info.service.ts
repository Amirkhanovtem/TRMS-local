import { Injectable } from '@angular/core';
import { CommonService } from '@common-services/common.service';
import { AuditModel } from '@components/audit/audit/models/audit.model';
import { Config } from '@config/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuditInfoService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/audit-info`;

  public getAuditInfosByEntityId(auditId: string): Observable<Array<AuditModel>> {
    return this.httpClient.get<Array<AuditModel>>(`${this.url}/audit/${auditId}`);
  }
}
