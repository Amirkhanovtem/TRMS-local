import { StandardEnumModel } from '@common-models/standard-enum.model';
import { ExamAttemptModel } from '@exam-result-models/exam-attempt.model';

export class ExamResultModel {
  public id: string = null;
  public examAttempts: Array<ExamAttemptModel> = [];
  public isPassed: boolean = false;
  public isRemainingTries: boolean = false;
  public isEditable: boolean = false;
  public cardCertificateInfo: StandardEnumModel = new StandardEnumModel();
}
