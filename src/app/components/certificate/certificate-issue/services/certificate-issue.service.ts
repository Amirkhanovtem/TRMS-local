import { Injectable } from '@angular/core';
import { CommonService } from '@common-services/common.service';
import { CertificateIssueModel } from '@components/certificate/certificate-issue/models/certificate-issue.model';
import { Config } from '@config/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CertificateIssueService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/certificate-issue`;

  public list(): Observable<Array<CertificateIssueModel>> {
    return this.httpClient.get<Array<CertificateIssueModel>>(`${this.url}/dictionary-table`);
  }

  public getCertificatesByPersonId(personId: string): Observable<Array<CertificateIssueModel>> {
    return this.httpClient.get<Array<CertificateIssueModel>>(`${this.url}/dictionary-table-by-person/${personId}`);
  }

  public removeIssuedCertificate(certificateId: string): Observable<any> {
    return this.httpClient.patch<any>(`${this.url}/remove/${certificateId}`, {});
  }
}
