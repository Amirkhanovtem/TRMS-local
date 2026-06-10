import { Injectable } from '@angular/core';
import { CommonService } from '@common-services/common.service';
import { Config } from '@config/config';
import { PositionModel } from '@position-models/position.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PositionService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/positions`;

  public list(): Observable<Array<PositionModel>> {
    return this.httpClient.get<Array<PositionModel>>(this.url);
  }

  public delete(listIdPosition: Array<string>): Observable<any> {
    return this.httpClient.patch(this.url, listIdPosition);
  }

  public create(position: PositionModel): Observable<any> {
    return this.httpClient.post(this.url, position);
  }

  public update(position: PositionModel): Observable<any> {
    return this.httpClient.put(`${this.url}/${position.id}`, position);
  }

  public getPosition(id: string): Observable<PositionModel> {
    return this.httpClient.get<PositionModel>(`${this.url}/${id}`);
  }
}
