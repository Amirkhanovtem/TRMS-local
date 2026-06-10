import { Injectable } from '@angular/core';
import { CityModel } from '@city-models/city.model';
import { CommonService } from '@common-services/common.service';
import { Config } from '@config/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CityService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/cities`;

  public list(): Observable<Array<CityModel>> {
    return this.httpClient.get<Array<CityModel>>(this.url);
  }

  public getIdNameList(): Observable<Array<CityModel>> {
    return this.httpClient.get<Array<CityModel>>(`${this.url}/list-id-name`);
  }

  public delete(listIdCity: Array<string>): Observable<any> {
    return this.httpClient.patch(this.url, listIdCity);
  }

  public create(city: CityModel): Observable<any> {
    return this.httpClient.post(this.url, city);
  }

  public update(city: CityModel): Observable<any> {
    return this.httpClient.put(`${this.url}/${city.id}`, city);
  }

  public getCity(id: string): Observable<CityModel> {
    return this.httpClient.get<CityModel>(`${this.url}/${id}`);
  }
}
