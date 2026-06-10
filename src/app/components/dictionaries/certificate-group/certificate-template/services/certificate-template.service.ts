import { Injectable } from '@angular/core';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { CommonAttachmentService } from '@common-services/common-attachment.service';
import { CertificateTemplateModel } from '@components/dictionaries/certificate-group/certificate-template/models/certificate-template.model';
import { Config } from '@config/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CertificateTemplateService extends CommonAttachmentService {
  private url: string = `${Config.MAIN_API_URL}/certificate-templates`;

  public list(): Observable<Array<CertificateTemplateModel>> {
    return this.httpClient.get<Array<CertificateTemplateModel>>(`${this.url}/dictionary-table`);
  }

  public getIdNameList(): Observable<Array<CertificateTemplateModel>> {
    return this.httpClient.get<Array<CertificateTemplateModel>>(`${this.url}/list-id-name`);
  }

  public getAllCertificateTemplatesUnattachedTrainingTemplate(): Observable<Array<CertificateTemplateModel>> {
    return this.httpClient.get<Array<CertificateTemplateModel>>(`${this.url}/list-id-name-unattached`);
  }

  public delete(listIdCertificateTemplate: Array<string>): Observable<any> {
    return this.httpClient.patch(this.url, listIdCertificateTemplate);
  }

  public create(certificateTemplate: CertificateTemplateModel): Observable<any> {
    return this.httpClient.post(this.url, this.collectCertificateModelToFormData(certificateTemplate));
  }

  public update(certificateTemplate: CertificateTemplateModel): Observable<any> {
    return this.httpClient.put(
      `${this.url}/${certificateTemplate.id}`,
      this.collectCertificateModelToFormData(certificateTemplate),
    );
  }

  public getCertificateTemplate(id: string): Observable<CertificateTemplateModel> {
    return this.httpClient.get<CertificateTemplateModel>(`${this.url}/save-update-form/${id}`);
  }

  public getAllCertificateTemplateTypes(): Observable<Array<StandardEnumModel>> {
    return this.httpClient.get<Array<StandardEnumModel>>(`${Config.MAIN_API_ENUM_URL}/allCertificateTypes`);
  }

  public getAllCertificateDurationTypes(): Observable<Array<StandardEnumModel>> {
    return this.httpClient.get<Array<StandardEnumModel>>(`${Config.MAIN_API_ENUM_URL}/allCertificateDurationTypes`);
  }

  public getAllCertificateTemplatesForGenerate(trainingId: string): Observable<Array<CertificateTemplateModel>> {
    return this.httpClient.get<Array<CertificateTemplateModel>>(`${this.url}/list-for-generate/${trainingId}`);
  }

  public updateGeneratedCertificatesFile(certificateTemplateIds: Array<string>, file: File): Observable<any> {
    const formData = new FormData();

    formData.append('certificateTemplateIds', this.createBlobForFormModel(certificateTemplateIds));
    formData.append('templateFile', file);

    return this.httpClient.post(`${this.url}/change-file-generated`, formData);
  }

  private collectCertificateModelToFormData(certificate: CertificateTemplateModel): FormData {
    const formData = new FormData();

    formData.append('certificateTemplateSaveUpdateRequestDTO', this.createBlobForFormModel(certificate));
    formData.append('templateFile', certificate.fileStorage?.templateFile);

    return formData;
  }
}
