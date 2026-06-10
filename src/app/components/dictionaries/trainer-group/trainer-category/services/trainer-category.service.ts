import { Injectable } from '@angular/core';
import { CommonService } from '@common-services/common.service';
import { StandardTreeModel } from '@common-tree-models/standard-tree.model';
import { Config } from '@config/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrainerCategoryService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/trainer-categories`;

  public listWithTrainers(): Observable<Array<StandardTreeModel>> {
    return this.httpClient.get<Array<StandardTreeModel>>(`${this.url}/with-trainers`);
  }

  public listWithoutTrainers(): Observable<Array<StandardTreeModel>> {
    return this.httpClient.get<Array<StandardTreeModel>>(`${this.url}/without-trainers`);
  }
}
