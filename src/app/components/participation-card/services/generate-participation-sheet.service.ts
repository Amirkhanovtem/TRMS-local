import { Injectable } from '@angular/core';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { CommonAttachmentService } from '@common-services/common-attachment.service';
import { Config } from '@config/config';
import { GenerateParticipationSheetModel } from '@participation-card-models/generate-participation-sheet.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GenerateParticipationSheetService extends CommonAttachmentService {
  private url: string = `${Config.MAIN_API_URL}/training-attendance-issue`;

  public getAllParticipationSheetFormats(): Observable<Array<StandardEnumModel>> {
    return this.httpClient.get<Array<StandardEnumModel>>(`${Config.MAIN_API_ENUM_URL}/allTrainingAttendanceTypes`);
  }

  public generateAndDownloadParticipationSheet(
    generateParticipationSheetModel: GenerateParticipationSheetModel,
  ): Observable<any> {
    return this.httpClient.post<any>(this.url, generateParticipationSheetModel, this.fileLoadResponseOption);
  }
}
