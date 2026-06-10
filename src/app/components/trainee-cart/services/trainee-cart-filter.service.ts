import { Injectable } from '@angular/core';
import { CommonService } from '@common-services/common.service';
import { Config } from '@config/config';
import { TrainingTemplateModel } from '@training-template-models/training-template.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TraineeCartFilterService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/trainee-cart/filters`;

  public saveSelectedTrainingTemplatesByCurrentUser(trainingTemplateIds: Array<string>): Observable<any> {
    return this.httpClient.post(`${this.url}/training-templates`, trainingTemplateIds);
  }

  public loadSelectedTrainingTemplatesByCurrentUser(): Observable<Array<TrainingTemplateModel>> {
    return this.httpClient.get<Array<TrainingTemplateModel>>(`${this.url}/training-templates`);
  }
}
