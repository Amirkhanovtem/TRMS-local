import { WithFileStorageInterface } from '@common-input-file-models/withFileStorage.interface';
import { StandardFileStorageModel } from '@common-models/standard-file-storage.model';
import { StandardNameIdModel } from '@common-models/standard-name-id.model';

export class TrainingNoteModel implements WithFileStorageInterface {
  public id: string;
  public author: StandardNameIdModel;
  public createTs: Date;
  public training: StandardNameIdModel;
  public participantTrainingCard: StandardNameIdModel = null;
  public comment: string;
  public fileStorage: StandardFileStorageModel = new StandardFileStorageModel();
}
