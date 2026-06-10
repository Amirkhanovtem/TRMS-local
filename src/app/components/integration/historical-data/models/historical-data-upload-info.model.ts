import { StandardEnumModel } from '@common-models/standard-enum.model';
import { StandardNameIdModel } from '@common-models/standard-name-id.model';

export class HistoricalDataUploadInfoModel {
  public rowNumber: number = null;

  public columnHeader: StandardNameIdModel = new StandardNameIdModel();

  public message: string = null;

  public type: StandardEnumModel = new StandardEnumModel();
}
