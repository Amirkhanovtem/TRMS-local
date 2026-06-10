import { StandardEnumModel } from '@common-models/standard-enum.model';
import { StandardNameIdModel } from '@common-models/standard-name-id.model';

export class ModuleCardModel {
  public id: string = null;
  public attendanceStatus: StandardEnumModel = new StandardEnumModel();
  public trainingModule: StandardNameIdModel = new StandardNameIdModel();
  public registrationOnEventType: StandardEnumModel = new StandardEnumModel();
  public person: StandardNameIdModel;
}
