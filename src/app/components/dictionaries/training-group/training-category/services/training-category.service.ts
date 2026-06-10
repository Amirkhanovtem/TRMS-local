import { Injectable } from '@angular/core';
import { StandardNameIdModel } from '@common-models/standard-name-id.model';
import { CommonService } from '@common-services/common.service';
import { StandardTreeModel } from '@common-tree-models/standard-tree.model';
import { Config } from '@config/config';
import { TrainingCategoryModel } from '@training-category-models/training-category.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrainingCategoryService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/training-categories`;

  public listWithTrainingTemplates(): Observable<Array<StandardTreeModel>> {
    return this.httpClient.get<Array<StandardTreeModel>>(`${this.url}/with-training-templates`);
  }

  public listWithTrainingTemplatesActive(): Observable<Array<StandardTreeModel>> {
    return this.httpClient.get<Array<StandardTreeModel>>(`${this.url}/with-training-templates-active`);
  }

  public listWithSyllabusTemplates(): Observable<Array<StandardTreeModel>> {
    return this.httpClient.get<Array<StandardTreeModel>>(`${this.url}/with-syllabus-templates`);
  }

  public listWithoutTrainingTemplates(): Observable<Array<StandardTreeModel>> {
    return this.httpClient.get<Array<StandardTreeModel>>(`${this.url}/without-training-templates`);
  }

  public getIdNameList(): Observable<Array<TrainingCategoryModel>> {
    return this.httpClient.get<Array<TrainingCategoryModel>>(`${this.url}/list-id-name`);
  }

  public delete(listIdTrainingCategory: Array<string>): Observable<any> {
    return this.httpClient.patch(this.url, listIdTrainingCategory);
  }

  public create(trainingCategory: TrainingCategoryModel): Observable<any> {
    return this.httpClient.post(this.url, trainingCategory);
  }

  public update(trainingCategory: TrainingCategoryModel): Observable<any> {
    return this.httpClient.put(`${this.url}/${trainingCategory.id}`, trainingCategory);
  }

  public getTrainingCategory(id: string): Observable<TrainingCategoryModel> {
    return this.httpClient.get<TrainingCategoryModel>(`${this.url}/${id}`);
  }

  public getFirstLevelList(): Observable<Array<StandardNameIdModel>> {
    return this.httpClient.get<Array<StandardNameIdModel>>(`${this.url}/first-level`);
  }
}
