import { WithFileStorageInterface } from '@common-input-file-models/withFileStorage.interface';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { StandardFileStorageModel } from '@common-models/standard-file-storage.model';

export class AimsIntegrationInfoModel implements WithFileStorageInterface {
  public id: string;
  public startDate: Date;
  public endDate: Date;
  public status: StandardEnumModel = new StandardEnumModel();
  public fileStorage: StandardFileStorageModel = new StandardFileStorageModel();
}
