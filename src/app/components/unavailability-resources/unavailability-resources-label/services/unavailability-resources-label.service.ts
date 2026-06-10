import { Injectable } from '@angular/core';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { CommonService } from '@common-services/common.service';
import { Config } from '@config/config';
import { UnavailabilityResourcesLabelModel } from '@unavailability-resources-label-models/unavailability-resources-label.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UnavailabilityResourcesLabelService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/unavailability/labels`;
  private enumUrl: string = Config.MAIN_API_ENUM_URL;

  public list(): Observable<Array<UnavailabilityResourcesLabelModel>> {
    return this.httpClient.get<Array<UnavailabilityResourcesLabelModel>>(this.url);
  }

  public delete(listIdUnavailabilityResourcesLabel: Array<string>): Observable<any> {
    return this.httpClient.patch(this.url, listIdUnavailabilityResourcesLabel);
  }

  public create(unavailabilityResourcesLabel: UnavailabilityResourcesLabelModel): Observable<any> {
    return this.httpClient.post(this.url, unavailabilityResourcesLabel);
  }

  public update(unavailabilityResourcesLabel: UnavailabilityResourcesLabelModel): Observable<any> {
    return this.httpClient.put(`${this.url}/${unavailabilityResourcesLabel.id}`, unavailabilityResourcesLabel);
  }

  public getUnavailabilityResourcesLabelById(id: string): Observable<UnavailabilityResourcesLabelModel> {
    return this.httpClient.get<UnavailabilityResourcesLabelModel>(`${this.url}/${id}`);
  }

  public getAllResourceGroups(): Observable<Array<StandardEnumModel>> {
    return this.httpClient.get<Array<StandardEnumModel>>(`${this.enumUrl}/allUnavailabilityLabelGroupResources`);
  }
}
