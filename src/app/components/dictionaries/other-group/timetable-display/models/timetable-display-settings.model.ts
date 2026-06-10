import { StandardNameIdModel } from '@common-models/standard-name-id.model';
import { TimetableDisplayRoomSettingsModel } from '@components/dictionaries/other-group/timetable-display/models/timetable-display-room-settings.model';
import { TimetableDisplayTrainingTemplateSettingsModel } from '@components/dictionaries/other-group/timetable-display/models/timetable-display-training-template-settings.model';
import { TimetableDisplayVisualSettingsModel } from '@components/dictionaries/other-group/timetable-display/models/timetable-display-visual-settings.model';

export class TimetableDisplaySettingsModel {
  public id: string;
  public timeTableDisplay: StandardNameIdModel;
  public timetableDisplayRoomSettings: TimetableDisplayRoomSettingsModel;
  public timetableDisplayTrainingTemplateSettings: TimetableDisplayTrainingTemplateSettingsModel;
  public timetableDisplayVisualSettings: TimetableDisplayVisualSettingsModel;
}
