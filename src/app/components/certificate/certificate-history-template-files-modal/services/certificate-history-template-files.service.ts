import { Injectable } from '@angular/core';
import { CommonAttachmentService } from '@common-services/common-attachment.service';
import { CertificateHistoryTemplateFileModel } from '@components/certificate/certificate-history-template-files-modal/models/certificate-history-template-file.model';
import { Config } from '@config/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CertificateHistoryTemplateFilesService extends CommonAttachmentService {
  private certificateTemplateUrl: string = `${Config.MAIN_API_URL}/certificate-templates/file-history`;
  private certificateUrl: string = `${Config.MAIN_API_URL}/certificates/file-history`;
  private url: string;

  public setUrl(isTemplate: boolean): void {
    this.url = isTemplate ? this.certificateTemplateUrl : this.certificateUrl;
  }

  public getHistoricalFilesById(id: string): Observable<Array<CertificateHistoryTemplateFileModel>> {
    return this.httpClient.get<Array<CertificateHistoryTemplateFileModel>>(`${this.url}/by-entity/${id}`);
  }

  public setActive(id: string): Observable<Array<CertificateHistoryTemplateFileModel>> {
    return this.httpClient.get<Array<CertificateHistoryTemplateFileModel>>(`${this.url}/set-active/${id}`);
  }

  public delete(listId: Array<string>): Observable<any> {
    return this.httpClient.patch(this.url, listId);
  }

  public uploadFile(certificateId: string, file: File): Observable<any> {
    return this.httpClient.post(`${this.url}/by-entity/${certificateId}`, this.collectFormData(file));
  }

  private collectFormData(file: File): FormData {
    const formData = new FormData();

    formData.append('file', file);

    return formData;
  }
}
