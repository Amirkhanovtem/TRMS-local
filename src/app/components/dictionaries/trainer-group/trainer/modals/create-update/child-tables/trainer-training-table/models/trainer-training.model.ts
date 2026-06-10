import { StandardEnumModel } from '@common-models/standard-enum.model';
import { ParentEventModel } from '@event-models/parent-event.model';

export class TrainerTrainingModel {
  public id: string = null;
  public trainingTemplateName: string = null;
  public modules: string = null;
  public role: StandardEnumModel = new StandardEnumModel();
  public startDateTraining: Date = null;
  public endDateTraining: Date = null;
  public trainingFactualStatus: StandardEnumModel = new StandardEnumModel();
  public parentEvent: ParentEventModel = new ParentEventModel();
}
