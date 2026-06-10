import { Injectable } from '@angular/core';
import { AttachmentInfoTableInterface } from '@attachment-info-table-interfaces/attachment-info-table.interface';
import { StandardFileStorageModel } from '@common-models/standard-file-storage.model';
import { CommonService } from '@common-services/common.service';
import { Config } from '@config/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExamAttemptAttachmentsService extends CommonService implements AttachmentInfoTableInterface {
  private url: string = `${Config.MAIN_API_URL}/exam-attempt-attachments`;

  public getAttachmentsListById(examAttemptId: string): Observable<Array<StandardFileStorageModel>> {
    return this.httpClient.get<Array<StandardFileStorageModel>>(`${this.url}/${examAttemptId}/list-id-name`);
  }

  public uploadAttachments(files, examAttemptId): Observable<any> {
    return this.httpClient.post(
      `${this.url}/upload`,
      ExamAttemptAttachmentsService.prepareModelToFormData(files, examAttemptId),
    );
  }

  public deleteAttachment(fileId): Observable<any> {
    return this.httpClient.delete(`${this.url}/${fileId}`);
  }

  private static prepareModelToFormData(files, examAttemptId): FormData {
    const formData = new FormData();

    if (files) {
      for (const file of files) {
        formData.append('files', file);
      }
    }

    if (examAttemptId) {
      formData.append('examAttempt.id', examAttemptId);
    }

    return formData;
  }
}
