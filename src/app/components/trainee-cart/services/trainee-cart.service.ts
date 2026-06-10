import { Injectable } from '@angular/core';
import { CommonService } from '@common-services/common.service';
import { TraineeCartModel } from '@components/trainee-cart/models/trainee-cart.model';
import { Config } from '@config/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TraineeCartService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/trainee-cart`;

  public listWithTrainingTemplates(trainingTemplateIds: Array<string>): Observable<Array<TraineeCartModel>> {
    return this.httpClient.post<Array<TraineeCartModel>>(this.url, trainingTemplateIds);
  }
}
