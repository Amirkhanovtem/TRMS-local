import { Injectable } from '@angular/core';
import { CommonService } from '@common-services/common.service';
import { Config } from '@config/config';
import { CostCenterModel } from '@cost-center-models/cost-center.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CostCenterService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/cost-centers`;

  public list(): Observable<Array<CostCenterModel>> {
    return this.httpClient.get<Array<CostCenterModel>>(this.url);
  }

  public delete(listIdCostCenter: Array<string>): Observable<any> {
    return this.httpClient.patch(this.url, listIdCostCenter);
  }

  public create(costCenter: CostCenterModel): Observable<any> {
    return this.httpClient.post(this.url, costCenter);
  }

  public update(costCenter: CostCenterModel): Observable<any> {
    return this.httpClient.put(`${this.url}/${costCenter.id}`, costCenter);
  }

  public getCostCenter(id: string): Observable<CostCenterModel> {
    return this.httpClient.get<CostCenterModel>(`${this.url}/${id}`);
  }
}
