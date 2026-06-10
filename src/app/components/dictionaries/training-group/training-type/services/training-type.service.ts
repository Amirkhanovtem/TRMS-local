import { Injectable } from '@angular/core';
import { CommonService } from '@common-services/common.service';
import { Config } from '@config/config';
import { TrainingTypeModel } from '@training-type-models/training-type.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrainingTypeService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/training-types`;

  public list(): Observable<Array<TrainingTypeModel>> {
    return this.httpClient.get<Array<TrainingTypeModel>>(this.url);
  }

  public getIdNameList(): Observable<Array<TrainingTypeModel>> {
    return this.httpClient.get<Array<TrainingTypeModel>>(`${this.url}/list-id-name`);
  }

  public delete(listIdTrainingType: Array<string>): Observable<any> {
    return this.httpClient.patch(this.url, listIdTrainingType);
  }

  public create(equipment: TrainingTypeModel): Observable<any> {
    return this.httpClient.post(this.url, equipment);
  }

  public update(equipment: TrainingTypeModel): Observable<any> {
    return this.httpClient.put(`${this.url}/${equipment.id}`, equipment);
  }

  public getTrainingType(id: string): Observable<TrainingTypeModel> {
    return this.httpClient.get<TrainingTypeModel>(`${this.url}/${id}`);
  }
}
