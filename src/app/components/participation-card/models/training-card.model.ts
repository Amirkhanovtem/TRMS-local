import { StandardEnumModel } from '@common-models/standard-enum.model';
import { StandardNameIdModel } from '@common-models/standard-name-id.model';
import { TrainingModel } from '@event-training-models/training.model';
import { ParticipantTrainingCardExamModel } from '@exam-result-models/participant-training-card-exam.model';
import { PersonModel } from '@person-models/person.model';

export class TrainingCardModel {
  public id: string = null;
  public attendanceStatus: StandardEnumModel = new StandardEnumModel();
  public registrationOnEventType: StandardEnumModel = new StandardEnumModel();
  public person: PersonModel = new PersonModel();
  public training: TrainingModel = null;
  public certificate: StandardNameIdModel = null;
  public certificateInfo: StandardEnumModel = null;
  public certificateTemplateInfo: StandardEnumModel = null;
  public participantTrainingCardExam: ParticipantTrainingCardExamModel = new ParticipantTrainingCardExamModel();
  public group: string = null;
}
