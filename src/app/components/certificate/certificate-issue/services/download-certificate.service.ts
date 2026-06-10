import { Injectable } from '@angular/core';
import { FileFormatEnum } from '@common-input-file-models/file-format.enum';
import { CommonAttachmentService } from '@common-services/common-attachment.service';
import { Config } from '@config/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DownloadCertificateService extends CommonAttachmentService {
  private url: string = `${Config.MAIN_API_URL}/certificates-download`;

  public downloadCertificates(participantTrainingCardIds: Array<string>, fileFormat: FileFormatEnum): Observable<any> {
    const requestParam = this.addParamsToOptions({ fileFormat: fileFormat });

    return this.httpClient.post<any>(`${this.url}/many`, participantTrainingCardIds, {
      ...this.fileLoadResponseOption,
      ...requestParam,
    });
  }
}
