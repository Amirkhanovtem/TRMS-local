import { StandardEnumModel } from '@common-models/standard-enum.model';
import { ParticipantTrainingCardExamModel } from '@exam-result-models/participant-training-card-exam.model';

export class ExamAttemptModel {
  public id: string = null;
  public participantTrainingCardExam: ParticipantTrainingCardExamModel = new ParticipantTrainingCardExamModel();
  public maxScore: number = 0;
  public score: number = 0;
  public attemptNumber: number = 1;
  public scoreType: StandardEnumModel = new StandardEnumModel();
}
