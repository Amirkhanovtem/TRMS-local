import { Injectable } from '@angular/core';
import { CommonService } from '@common-services/common.service';
import { Config } from '@config/config';
import { ExamAttemptModel } from '@exam-result-models/exam-attempt.model';
import { ExamResultModel } from '@exam-result-models/exam-result.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExamResultService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/exam-passing`;

  public list(participantTrainingCardExamId: string): Observable<ExamResultModel> {
    return this.httpClient.get<ExamResultModel>(`${this.url}/${participantTrainingCardExamId}`);
  }

  public create(examAttempt: ExamAttemptModel): Observable<any> {
    return this.httpClient.post(`${this.url}/create-attempt`, examAttempt);
  }

  public delete(examAttempt: ExamAttemptModel): Observable<any> {
    return this.httpClient.delete(`${this.url}/delete-attempt/` + examAttempt.id);
  }

  public update(examAttempt: ExamAttemptModel): Observable<any> {
    return this.httpClient.post(`${this.url}/update-attempt`, examAttempt);
  }

  public getExamAttemptDetail(examResultId: string): Observable<ExamAttemptModel> {
    return this.httpClient.get<ExamAttemptModel>(`${this.url}/exam-result-detail/${examResultId}`);
  }

  public getPreparedBodyForExamAttempt(participantTrainingCardExamId: string): Observable<ExamAttemptModel> {
    return this.httpClient.get<ExamAttemptModel>(`${this.url}/create-attempt/${participantTrainingCardExamId}`);
  }
}
