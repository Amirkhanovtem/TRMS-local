import { Injectable } from '@angular/core';
import { CommonService } from '@common-services/common.service';
import { CompleteTrainingModel } from '@complete-trainings-models/complete-training.model';
import { Config } from '@config/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompleteTrainingsService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/completed-trainings`;

  public list(): Observable<Array<CompleteTrainingModel>> {
    return this.httpClient.get<Array<CompleteTrainingModel>>(this.url);
  }
}
