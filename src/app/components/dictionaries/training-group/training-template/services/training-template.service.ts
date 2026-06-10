import { Injectable } from '@angular/core';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { StandardNameIdModel } from '@common-models/standard-name-id.model';
import { CommonService } from '@common-services/common.service';
import { Config } from '@config/config';
import { TrainingTemplateModel } from '@training-template-models/training-template.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrainingTemplateService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/training-templates`;
  private enumUrl: string = Config.MAIN_API_ENUM_URL;

  public list(): Observable<Array<TrainingTemplateModel>> {
    return this.httpClient.get<Array<TrainingTemplateModel>>(`${this.url}/dictionary-table`);
  }

  public listByExamTemplateId(examTemplateId: string): Observable<Array<TrainingTemplateModel>> {
    return this.httpClient.get<Array<TrainingTemplateModel>>(
      `${this.url}/dictionary-table-by-exam-template/${examTemplateId}`,
    );
  }

  public delete(listIdTrainingTemplate: Array<string>): Observable<any> {
    return this.httpClient.patch(this.url, listIdTrainingTemplate);
  }

  public create(trainingTemplate: TrainingTemplateModel): Observable<any> {
    return this.httpClient.post(this.url, trainingTemplate);
  }

  public update(trainingTemplate: TrainingTemplateModel): Observable<any> {
    return this.httpClient.put(`${this.url}/${trainingTemplate.id}`, trainingTemplate);
  }

  public getTrainingTemplate(id: string): Observable<TrainingTemplateModel> {
    return this.httpClient.get<TrainingTemplateModel>(`${this.url}/save-update-form/${id}`);
  }

  public getAllTrainingTemplateFormatTypes(): Observable<Array<StandardEnumModel>> {
    return this.httpClient.get<Array<StandardEnumModel>>(`${this.enumUrl}/allTrainingTemplateFormatTypes`);
  }

  public getAllTrainingTemplateStatus(): Observable<Array<StandardEnumModel>> {
    return this.httpClient.get<Array<StandardEnumModel>>(`${this.enumUrl}/allTrainingTemplateStatuses`);
  }

  public getTrainingTemplateListForCreatingEvent(): Observable<Array<StandardNameIdModel>> {
    return this.httpClient.get<Array<StandardNameIdModel>>(`${this.url}/list-id-name`);
  }
}
