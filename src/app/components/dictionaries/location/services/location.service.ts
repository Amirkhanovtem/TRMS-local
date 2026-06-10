import { Injectable } from '@angular/core';
import { CommonService } from '@common-services/common.service';
import { StandardTreeModel } from '@common-tree-models/standard-tree.model';
import { Config } from '@config/config';
import { LocationModel } from '@location-models/location.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/locations`;

  public list(): Observable<Array<LocationModel>> {
    return this.httpClient.get<Array<LocationModel>>(this.url);
  }

  public hierarchyListWithEquipmentsAndEquipmentCategories(): Observable<Array<StandardTreeModel>> {
    return this.httpClient.get<Array<StandardTreeModel>>(`${this.url}/tree`);
  }

  public delete(listIdLocation: Array<string>): Observable<any> {
    return this.httpClient.patch(this.url, listIdLocation);
  }

  public create(location: LocationModel): Observable<any> {
    return this.httpClient.post(this.url, location);
  }

  public update(location: LocationModel): Observable<any> {
    return this.httpClient.put(`${this.url}/${location.id}`, location);
  }

  public getLocation(id: string): Observable<LocationModel> {
    return this.httpClient.get<LocationModel>(`${this.url}/${id}`);
  }

  public getLocationName(location: LocationModel): string {
    return `${location.name} (${location.address})`;
  }
}
