import { Injectable } from '@angular/core';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { CommonService } from '@common-services/common.service';
import { Config } from '@config/config';
import { ExamTemplateModel } from '@exam-template-models/exam-template.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExamTemplateService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/exam-templates`;

  public list(): Observable<Array<ExamTemplateModel>> {
    return this.httpClient.get<Array<ExamTemplateModel>>(this.url);
  }

  public getIdNameList(): Observable<Array<ExamTemplateModel>> {
    return this.httpClient.get<Array<ExamTemplateModel>>(`${this.url}/list-id-name`);
  }

  public delete(listIdExam: Array<string>): Observable<any> {
    return this.httpClient.patch(this.url, listIdExam);
  }

  public create(exam: ExamTemplateModel): Observable<any> {
    return this.httpClient.post(this.url, exam);
  }

  public update(exam: ExamTemplateModel): Observable<any> {
    return this.httpClient.put(`${this.url}/${exam.id}`, exam);
  }

  public getExamTemplate(id: string): Observable<ExamTemplateModel> {
    return this.httpClient.get<ExamTemplateModel>(`${this.url}/${id}`);
  }

  public getAllExamTemplateTypes(): Observable<Array<StandardEnumModel>> {
    return this.httpClient.get<Array<StandardEnumModel>>(`${Config.MAIN_API_ENUM_URL}/allExamTypes`);
  }

  public getAllExamScoreTypes(): Observable<Array<StandardEnumModel>> {
    return this.httpClient.get<Array<StandardEnumModel>>(`${Config.MAIN_API_ENUM_URL}/allScoreTypes`);
  }
}
