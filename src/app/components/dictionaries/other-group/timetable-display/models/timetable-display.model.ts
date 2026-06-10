import { StandardNameIdModel } from '@common-models/standard-name-id.model';
import { TimetableDisplaySettingsModel } from '@components/dictionaries/other-group/timetable-display/models/timetable-display-settings.model';

export class TimetableDisplayModel extends StandardNameIdModel {
  public username: string;
  public description: string;
  public settings: TimetableDisplaySettingsModel;
}
