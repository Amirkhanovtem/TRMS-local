import { StandardEnumModel } from '@common-models/standard-enum.model';
import { StandardNameIdModel } from '@common-models/standard-name-id.model';

export class GenerateParticipationSheetModel {
  public training: StandardNameIdModel = new StandardNameIdModel();
  public trainingAttendanceType: StandardEnumModel = new StandardEnumModel();
}
