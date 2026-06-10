import { StandardEnumModel } from '@common-models/standard-enum.model';
import { StandardNameIdModel } from '@common-models/standard-name-id.model';
import { TrainingTemplateModel } from '@training-template-models/training-template.model';

export class TimetableDisplayTrainingTemplateModel extends StandardNameIdModel {
  public trainingTemplate: TrainingTemplateModel;
  public status: StandardEnumModel;
}
