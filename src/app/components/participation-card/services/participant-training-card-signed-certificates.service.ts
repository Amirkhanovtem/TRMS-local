import { Injectable } from '@angular/core';
import { AttachmentInfoTableInterface } from '@attachment-info-table-interfaces/attachment-info-table.interface';
import { StandardFileStorageModel } from '@common-models/standard-file-storage.model';
import { CommonService } from '@common-services/common.service';
import { Config } from '@config/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ParticipantTrainingCardSignedCertificatesService
  extends CommonService
  implements AttachmentInfoTableInterface
{
  private url: string = `${Config.MAIN_API_URL}/signed-certificate`;

  public getAttachmentsListById(participantTrainingCardId: string): Observable<Array<StandardFileStorageModel>> {
    return this.httpClient.get<Array<StandardFileStorageModel>>(
      `${this.url}/${participantTrainingCardId}/list-id-name`,
    );
  }

  public uploadAttachments(files, participantTrainingCardId): Observable<any> {
    return this.httpClient.post(
      `${this.url}/upload`,
      ParticipantTrainingCardSignedCertificatesService.prepareModelToFormData(files, participantTrainingCardId),
    );
  }

  public deleteAttachment(fileId): Observable<any> {
    return this.httpClient.delete(`${this.url}/${fileId}`);
  }

  private static prepareModelToFormData(files, participantTrainingCardId): FormData {
    const formData = new FormData();

    if (files) {
      for (const file of files) {
        formData.append('files', file);
      }
    }

    if (participantTrainingCardId) {
      formData.append('participantTrainingCard.id', participantTrainingCardId);
    }

    return formData;
  }
}
