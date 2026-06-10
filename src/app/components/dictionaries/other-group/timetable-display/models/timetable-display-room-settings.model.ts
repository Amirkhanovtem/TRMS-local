import { StandardEnumModel } from '@common-models/standard-enum.model';
import { TimetableDisplayRoomModel } from '@components/dictionaries/other-group/timetable-display/models/timetable-display-room.model';

export class TimetableDisplayRoomSettingsModel {
  public id: string;
  public loadStrategy: StandardEnumModel;
  public timetableDisplayRooms: Array<TimetableDisplayRoomModel>;
}
