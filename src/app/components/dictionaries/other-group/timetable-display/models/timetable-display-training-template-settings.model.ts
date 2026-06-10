import { StandardEnumModel } from '@common-models/standard-enum.model';
import { TimetableDisplayTrainingTemplateModel } from '@components/dictionaries/other-group/timetable-display/models/timetable-display-training-template.model';

export class TimetableDisplayTrainingTemplateSettingsModel {
  public id: string;
  public loadStrategy: StandardEnumModel;
  public timetableDisplayTrainingTemplates: Array<TimetableDisplayTrainingTemplateModel>;
}
