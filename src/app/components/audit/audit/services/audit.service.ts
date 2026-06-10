import { Injectable } from '@angular/core';
import { CommonService } from '@common-services/common.service';
import { AuditModel } from '@components/audit/audit/models/audit.model';
import { Config } from '@config/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuditService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/audit`;

  public getAllAudits(): Observable<Array<AuditModel>> {
    return this.httpClient.get<Array<AuditModel>>(`${this.url}`);
  }

  public getAuditsByEntityId(entityId: string): Observable<Array<AuditModel>> {
    return this.httpClient.get<Array<AuditModel>>(`${this.url}/entity/${entityId}`);
  }
}
