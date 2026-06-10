import { Injectable } from '@angular/core';
import { CommonService } from '@common-services/common.service';
import { StandardTreeModel } from '@common-tree-models/standard-tree.model';
import { Config } from '@config/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubdivisionService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/subdivisions`;

  public list(): Observable<Array<StandardTreeModel>> {
    return this.httpClient.get<Array<StandardTreeModel>>(this.url);
  }
}
