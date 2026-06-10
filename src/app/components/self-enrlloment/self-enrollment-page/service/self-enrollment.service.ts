import { Injectable } from '@angular/core';
import { CityModel } from '@city-models/city.model';
import { CommonService } from '@common-services/common.service';
import { SelfEnrollmentEventModel } from '@components/self-enrlloment/self-enrollment-page/components/self-enrollment-events/models/self-enrollment-event.model';
import { TrainingSelfEnrollmentModel } from '@components/self-enrlloment/self-enrollment-page/components/self-enrollment-events/models/training-self-enrollment.model';
import { SelfEnrollmentFilterModel } from '@components/self-enrlloment/self-enrollment-page/components/self-enrollment-filters/models/self-enrollment-filter.model';
import { Config } from '@config/config';
import { TrainingTemplateModel } from '@training-template-models/training-template.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SelfEnrollmentService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/self-enrollment`;

  public getTrainingTemplateFilter(): Observable<Array<TrainingTemplateModel>> {
    return this.httpClient.get<Array<TrainingTemplateModel>>(`${this.url}/data/filter/training-template`);
  }

  public getCityFilter(): Observable<Array<CityModel>> {
    return this.httpClient.get<Array<CityModel>>(`${this.url}/data/filter/city`);
  }

  public getEventsData(filters: SelfEnrollmentFilterModel): Observable<Array<TrainingSelfEnrollmentModel>> {
    return this.httpClient.post<Array<TrainingSelfEnrollmentModel>>(`${this.url}/data/training`, filters);
  }

  public enroll(eventId: string): Observable<any> {
    return this.httpClient.get(`${this.url}/enroll/training/${eventId}`);
  }

  public unenroll(eventId: string): Observable<any> {
    return this.httpClient.get(`${this.url}/unenroll/training/${eventId}`);
  }

  public updateEvent(eventId: string): Observable<SelfEnrollmentEventModel> {
    return this.httpClient.get<SelfEnrollmentEventModel>(`${this.url}/data/training/${eventId}`);
  }
}
