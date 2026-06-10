import { Injectable } from '@angular/core';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { CommonService } from '@common-services/common.service';
import { Config } from '@config/config';
import { TrainingModel } from '@event-training-models/training.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationTemplateCheckingService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/checking-notification-templates`;

  public checkTrainingDateTimeLocationWasChanged(trainingList: Array<TrainingModel>): Observable<Array<TrainingModel>> {
    return this.httpClient.post<Array<TrainingModel>>(`${this.url}/data-time-location-was-changed`, trainingList);
  }

  public checkTrainingCompleted(trainingId: string, newStatus: StandardEnumModel): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.url}/training-completed-or-canceled/${trainingId}`, newStatus);
  }
}
