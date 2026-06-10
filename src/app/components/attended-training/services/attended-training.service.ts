import { Injectable } from '@angular/core';
import { AttendedTrainingModel } from '@attended-training-models/attended-training.model';
import { CommonService } from '@common-services/common.service';
import { Config } from '@config/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AttendedTrainingService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/attended-training`;

  public list(personId: string): Observable<Array<AttendedTrainingModel>> {
    return this.httpClient.get<Array<AttendedTrainingModel>>(`${this.url}/${personId}`);
  }
}
