import { Injectable } from '@angular/core';
import { CommonService } from '@common-services/common.service';
import { Config } from '@config/config';
import { TrainerModel } from '@trainer-models/trainer.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrainerService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/trainers`;
  public searchTrainerUrl: string = `${Config.MAIN_API_URL}/trainer-search`;

  public list(): Observable<Array<TrainerModel>> {
    return this.httpClient.get<Array<TrainerModel>>(`${this.url}/dictionary-table`);
  }

  public delete(listIdTrainer: Array<string>): Observable<any> {
    return this.httpClient.patch(this.url, listIdTrainer);
  }

  public create(trainer: TrainerModel): Observable<any> {
    return this.httpClient.post(this.url, trainer);
  }

  public update(trainer: TrainerModel): Observable<any> {
    return this.httpClient.put(`${this.url}/${trainer.id}`, trainer);
  }

  public getTrainer(id: string): Observable<TrainerModel> {
    return this.httpClient.get<TrainerModel>(`${this.url}/save-update-form/${id}`);
  }

  public getAllMainTrainersByTrainingTemplate(trainingTemplateId: string): Observable<Array<TrainerModel>> {
    return this.httpClient.get<Array<TrainerModel>>(`${this.searchTrainerUrl}/main/by-template/${trainingTemplateId}`);
  }

  public getAllLinearTrainersByTrainingTemplate(trainingTemplateId: string): Observable<Array<TrainerModel>> {
    return this.httpClient.get<Array<TrainerModel>>(
      `${this.searchTrainerUrl}/linear/by-template/${trainingTemplateId}`,
    );
  }
}
