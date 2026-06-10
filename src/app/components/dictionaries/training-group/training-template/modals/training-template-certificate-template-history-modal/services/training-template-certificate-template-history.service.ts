import { Injectable } from '@angular/core';
import { CommonService } from '@common-services/common.service';
import { Config } from '@config/config';
import { TrainingTemplateCertificateTemplateHistoryModel } from '@training-template-modals/training-template-certificate-template-history-modal/models/training-template-certificate-template-history.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrainingTemplateCertificateTemplateHistoryService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/certificate-templates/training-template-history`;

  public getAllByCertificateTemplateId(
    сertificateTemplateId: string,
  ): Observable<Array<TrainingTemplateCertificateTemplateHistoryModel>> {
    return this.httpClient.get<Array<TrainingTemplateCertificateTemplateHistoryModel>>(
      `${this.url}/by-entity/${сertificateTemplateId}`,
    );
  }
}
