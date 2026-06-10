import { Injectable } from '@angular/core';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { CommonAttachmentService } from '@common-services/common-attachment.service';
import { Config } from '@config/config';
import { ParticipantTrainingCardCertificateInfoEnum } from '@participation-card-models/participant-training-card-certificate-info.enum';
import { ParticipationDataUpdateResponseModel } from '@participation-card-models/participation-data-update-response.model';
import { ParticipationListTableDataModel } from '@participation-card-models/participation-list-table-data.model';
import { TrainingCardModel } from '@participation-card-models/training-card.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ParticipationCardService extends CommonAttachmentService {
  private url: string = `${Config.MAIN_API_URL}/participation`;

  public list(trainingId: string): Observable<ParticipationListTableDataModel> {
    return this.httpClient.get<ParticipationListTableDataModel>(`${this.url}/${trainingId}`);
  }

  public saveParticipationCards(
    participationDataUpdateResponseModel: ParticipationDataUpdateResponseModel,
  ): Observable<any> {
    return this.httpClient.post<Observable<any>>(`${this.url}/update`, participationDataUpdateResponseModel);
  }

  public getAllTrainingAttendanceStatus(): Observable<Array<StandardEnumModel>> {
    return this.httpClient.get<Array<StandardEnumModel>>(
      `${Config.MAIN_API_ENUM_URL}/allParticipantTrainingCardAttendanceStatuses`,
    );
  }

  public getAllModuleAttendanceStatus(): Observable<Array<StandardEnumModel>> {
    return this.httpClient.get<Array<StandardEnumModel>>(
      `${Config.MAIN_API_ENUM_URL}/allParticipantModuleCardAttendanceStatuses`,
    );
  }

  public getAllFactualStatus(): Observable<Array<StandardEnumModel>> {
    return this.httpClient.get<Array<StandardEnumModel>>(`${Config.MAIN_API_ENUM_URL}/allTrainingFactualStatuses`);
  }

  public participationTrainingCardHasCertificate(participationTrainingCard: TrainingCardModel): boolean {
    const certificateInfo: ParticipantTrainingCardCertificateInfoEnum =
      ParticipantTrainingCardCertificateInfoEnum[participationTrainingCard.certificateInfo.id];

    return (
      certificateInfo === ParticipantTrainingCardCertificateInfoEnum.HAS_CERTIFICATE ||
      certificateInfo === ParticipantTrainingCardCertificateInfoEnum.HAS_CERTIFICATE_FILE ||
      certificateInfo === ParticipantTrainingCardCertificateInfoEnum.HAS_SIGNED_CERTIFICATE
    );
  }
}
