import { Injectable } from '@angular/core';
import { StandardNameIdModel } from '@common-models/standard-name-id.model';
import { CommonAttachmentService } from '@common-services/common-attachment.service';
import { Config } from '@config/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ParticipantTrainingCardService extends CommonAttachmentService {
  private url: string = `${Config.MAIN_API_URL}/participant-training-cards`;

  public checkExistsBeforeDeleteEvent(trainingIds: Array<string>): Observable<boolean> {
    const body = {
      trainingIds: trainingIds,
    };

    return this.httpClient.post<boolean>(`${this.url}/check-exists-before-delete-event`, body);
  }

  public getAllParticipantCardsByTraining(trainingId: string): Observable<Array<StandardNameIdModel>> {
    return this.httpClient.get<Array<StandardNameIdModel>>(`${this.url}/training/${trainingId}`);
  }
}
