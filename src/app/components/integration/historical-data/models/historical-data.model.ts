import { WithFileStorageInterface } from '@common-input-file-models/withFileStorage.interface';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { StandardFileStorageModel } from '@common-models/standard-file-storage.model';

export class HistoricalDataModel implements WithFileStorageInterface {
  public id: string;
  public startTime: Date;
  public endTime: Date;
  public status: StandardEnumModel = new StandardEnumModel();
  public type: StandardEnumModel = new StandardEnumModel();
  public fileStorage: StandardFileStorageModel = new StandardFileStorageModel();
}
