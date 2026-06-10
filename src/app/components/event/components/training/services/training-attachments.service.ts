import { Injectable } from '@angular/core';
import { AttachmentInfoTableInterface } from '@attachment-info-table-interfaces/attachment-info-table.interface';
import { StandardFileStorageModel } from '@common-models/standard-file-storage.model';
import { CommonService } from '@common-services/common.service';
import { Config } from '@config/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrainingAttachmentsService extends CommonService implements AttachmentInfoTableInterface {
  private url: string = `${Config.MAIN_API_URL}/training-attachments`;

  public getAttachmentsListById(trainingId: string): Observable<Array<StandardFileStorageModel>> {
    return this.httpClient.get<Array<StandardFileStorageModel>>(`${this.url}/${trainingId}/list-id-name`);
  }

  public uploadAttachments(files, trainingId): Observable<any> {
    return this.httpClient.post(
      `${this.url}/upload`,
      TrainingAttachmentsService.prepareModelToFormData(files, trainingId),
    );
  }

  public deleteAttachment(fileId): Observable<any> {
    return this.httpClient.delete(`${this.url}/${fileId}`);
  }

  private static prepareModelToFormData(files, trainingId): FormData {
    const formData = new FormData();

    if (files) {
      for (const file of files) {
        formData.append('files', file);
      }
    }

    if (trainingId) {
      formData.append('training.id', trainingId);
    }

    return formData;
  }
}
