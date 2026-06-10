import { Injectable } from '@angular/core';
import { StandardNameIdModel } from '@common-models/standard-name-id.model';
import { CommonService } from '@common-services/common.service';
import { Config } from '@config/config';
import { SyllabusTemplateModel } from '@syllabus-template-models/syllabus-template.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SyllabusTemplateService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/syllabus-templates`;

  public list(): Observable<Array<SyllabusTemplateModel>> {
    return this.httpClient.get<Array<SyllabusTemplateModel>>(`${this.url}/dictionary-table`);
  }

  public listByTrainingTemplateId(trainingTemplateId: string): Observable<Array<SyllabusTemplateModel>> {
    return this.httpClient.get<Array<SyllabusTemplateModel>>(
      `${this.url}/dictionary-table-by-training-template/${trainingTemplateId}`,
    );
  }

  public delete(listIdEquipment: Array<string>): Observable<any> {
    return this.httpClient.patch(this.url, listIdEquipment);
  }

  public create(syllabus: SyllabusTemplateModel): Observable<any> {
    return this.httpClient.post(this.url, syllabus);
  }

  public update(syllabus: SyllabusTemplateModel): Observable<any> {
    return this.httpClient.put(`${this.url}/${syllabus.id}`, syllabus);
  }

  public getSyllabusTemplate(id: string): Observable<SyllabusTemplateModel> {
    return this.httpClient.get<SyllabusTemplateModel>(`${this.url}/save-update-form/${id}`);
  }

  public getSyllabusTemplateListForCreatingEvent(): Observable<Array<StandardNameIdModel>> {
    return this.httpClient.get<Array<StandardNameIdModel>>(`${this.url}/list-id-name`);
  }

  public getSyllabusTemplateListIdNameCode(): Observable<Array<SyllabusTemplateModel>> {
    return this.httpClient.get<Array<SyllabusTemplateModel>>(`${this.url}/list-id-name-code`);
  }
}
