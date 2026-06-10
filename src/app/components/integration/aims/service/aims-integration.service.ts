import { Injectable } from '@angular/core';
import { CommonAttachmentService } from '@common-services/common-attachment.service';
import { AimsIntegrationInfoModel } from '@components/integration/aims/aims-integration-info/models/aims-integration-info.model';
import { AimsIntegrationInfoDetailModel } from '@components/integration/aims/aims-integration-info/models/aims-integration-info-detail.model';
import { Config } from '@config/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AimsIntegrationService extends CommonAttachmentService {
  private url: string = `${Config.MAIN_API_URL}/integration/aims`;

  public startIntegration(): Observable<any> {
    return this.httpClient.get<any>(`${this.url}/start-integration`);
  }

  public getAllAimsIntegrationInfo(): Observable<Array<AimsIntegrationInfoModel>> {
    return this.httpClient.get<Array<AimsIntegrationInfoModel>>(`${this.url}/info`);
  }

  public getAimsIntegrationInfoDetail(infoId: string): Observable<Array<AimsIntegrationInfoDetailModel>> {
    return this.httpClient.get<Array<AimsIntegrationInfoDetailModel>>(`${this.url}/info/detail/${infoId}`);
  }
}
