import { Injectable } from '@angular/core';
import { CommonService } from '@common-services/common.service';
import { CertificateTemplateGroupModel } from '@components/dictionaries/certificate-group/certificate-template-group/models/certificate-template-group.model';
import { Config } from '@config/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CertificateTemplateGroupService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/certificate-template-groups`;

  public list(): Observable<Array<CertificateTemplateGroupModel>> {
    return this.httpClient.get<Array<CertificateTemplateGroupModel>>(this.url);
  }

  public getCertificateTemplateGroup(id: string): Observable<CertificateTemplateGroupModel> {
    return this.httpClient.get<CertificateTemplateGroupModel>(`${this.url}/${id}`);
  }

  public create(certificateTemplateGroup: CertificateTemplateGroupModel): Observable<any> {
    return this.httpClient.post(this.url, certificateTemplateGroup);
  }

  public update(certificateTemplateGroup: CertificateTemplateGroupModel): Observable<any> {
    return this.httpClient.put(`${this.url}/${certificateTemplateGroup.id}`, certificateTemplateGroup);
  }

  public delete(listIdCertificateTemplateGroups: Array<string>): Observable<any> {
    return this.httpClient.patch(this.url, listIdCertificateTemplateGroups);
  }

  public getGroupsByCertificateTemplateId(certificateTemplateId: string): Observable<CertificateTemplateGroupModel> {
    return this.httpClient.get<CertificateTemplateGroupModel>(
      `${this.url}/get-certificate-template-groups-by-certificate-template/${certificateTemplateId}`,
    );
  }
}
