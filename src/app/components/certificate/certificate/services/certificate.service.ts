import { Injectable } from '@angular/core';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { CommonService } from '@common-services/common.service';
import { CertificateModel } from '@components/certificate/certificate/models/certificate.model';
import { Config } from '@config/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CertificateService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/certificates`;
  private enumUrl: string = Config.MAIN_API_ENUM_URL;

  public getCertificateForUpdate(id: string): Observable<CertificateModel> {
    return this.httpClient.get<CertificateModel>(`${this.url}/for-update/${id}`);
  }

  public update(certificate: CertificateModel): Observable<any> {
    return this.httpClient.put(`${this.url}/${certificate.id}`, certificate);
  }

  public getCertificateReissueHierarchyById(certificateId: string): Observable<Array<CertificateModel>> {
    return this.httpClient.get<Array<CertificateModel>>(`${this.url}/nodes/${certificateId}`);
  }

  public getAllCertificateStatus(): Observable<Array<StandardEnumModel>> {
    return this.httpClient.get<Array<StandardEnumModel>>(`${this.enumUrl}/allCertificateStatuses`);
  }
}
