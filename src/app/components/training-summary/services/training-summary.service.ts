import { Injectable } from '@angular/core';
import { CommonService } from '@common-services/common.service';
import { TrainingSummaryModel } from '@components/training-summary/models/training-summary.model';
import { Config } from '@config/config';
import { PersonTrainingModel } from '@profile-child-tables-person-training-models/person-training.model';
import { TrainerTrainingModel } from '@trainer-modals-create-update-child-tables-trainer-training-table/models/trainer-training.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrainingSummaryService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/training-summary`;

  public getTrainingsSummary(): Observable<Array<TrainingSummaryModel>> {
    return this.httpClient.get<Array<TrainingSummaryModel>>(`${this.url}/report`);
  }

  public getTrainingsSummaryByPersonId(personId: string): Observable<Array<PersonTrainingModel>> {
    return this.httpClient.get<Array<PersonTrainingModel>>(`${this.url}/person/${personId}`);
  }

  public getTrainingsSummaryByTrainerId(trainerId: string): Observable<Array<TrainerTrainingModel>> {
    return this.httpClient.get<Array<TrainerTrainingModel>>(`${this.url}/trainer/${trainerId}`);
  }
}
