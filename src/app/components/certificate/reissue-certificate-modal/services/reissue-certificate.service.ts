import { Injectable } from '@angular/core';
import { CommonService } from '@common-services/common.service';
import { FindCertsForReissueDataInterface } from '@components/certificate/reissue-certificate-modal/models/find-certs-for-reissue-data.interface';
import { ReissueCertificateModel } from '@components/certificate/reissue-certificate-modal/models/reissue-certificate.model';
import { Config } from '@config/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReissueCertificateService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/certificate-reissue`;

  public findCertsForReissue(data: FindCertsForReissueDataInterface): Observable<any> {
    return this.httpClient.post(`${this.url}/find-certs-for-reissue`, data);
  }

  public reissueCertificates(reissueCertificates: Array<ReissueCertificateModel>): Observable<any> {
    return this.httpClient.post(`${this.url}/reissue-certificates`, reissueCertificates);
  }
}
