import { Injectable } from '@angular/core';
import { CommonService } from '@common-services/common.service';
import { Config } from '@config/config';
import { UnavailabilityResourcePeriodModel } from '@unavailability-resources-period-models/unavailability-resource-period.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UnavailabilityResourcesPeriodService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/unavailability/resources`;

  public list(): Observable<Array<UnavailabilityResourcePeriodModel>> {
    return this.httpClient.get<Array<UnavailabilityResourcePeriodModel>>(this.url);
  }

  public listByPeriod(startDate, endDate): Observable<Array<UnavailabilityResourcePeriodModel>> {
    return this.httpClient.post<Array<UnavailabilityResourcePeriodModel>>(`${this.url}/by-period`, {
      startDate: startDate,
      endDate: endDate,
    });
  }

  public create(unavailabilityResourcePeriodList: Array<UnavailabilityResourcePeriodModel>): Observable<any> {
    return this.httpClient.post(this.url, unavailabilityResourcePeriodList);
  }

  public update(unavailabilityResourcePeriod: UnavailabilityResourcePeriodModel): Observable<any> {
    return this.httpClient.put(`${this.url}/${unavailabilityResourcePeriod.id}`, unavailabilityResourcePeriod);
  }

  public delete(listIdUnavailabilityResourcePeriod: Array<string>): Observable<any> {
    return this.httpClient.patch(this.url, listIdUnavailabilityResourcePeriod);
  }

  public getUnavailabilityResourcePeriodById(id: string): Observable<UnavailabilityResourcePeriodModel> {
    return this.httpClient.get<UnavailabilityResourcePeriodModel>(`${this.url}/${id}`);
  }
}
