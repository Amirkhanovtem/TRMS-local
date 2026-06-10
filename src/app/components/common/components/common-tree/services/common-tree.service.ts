import { Injectable } from '@angular/core';
import { CommonService } from '@common-services/common.service';
import { DefaultCreateUpdateNodeModel } from '@common-tree-models/default-create-update-node.model';
import { StandardFlatNodeModel } from '@common-tree-models/standard-flat-node.model';
import { Config } from '@config/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonTreeService extends CommonService {
  private url: string = Config.MAIN_API_URL;

  public create(object: DefaultCreateUpdateNodeModel, urlService: string): Observable<any> {
    const fullUrl = this.url + urlService;

    return this.httpClient.post(fullUrl, object);
  }

  public findById(object: StandardFlatNodeModel, urlService: string): Observable<any> {
    const fullUrl = this.url + urlService + '/' + object.id;

    return this.httpClient.get(fullUrl);
  }

  public edit(object: DefaultCreateUpdateNodeModel, urlService: string): Observable<any> {
    const fullUrl = this.url + urlService + '/' + object.id;

    return this.httpClient.put(fullUrl, object);
  }

  public delete(object: StandardFlatNodeModel, urlService: string): Observable<any> {
    const fullUrl = this.url + urlService + '/' + object.id;

    return this.httpClient.delete(fullUrl);
  }
}
