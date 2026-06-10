import { StandardFileStorageModel } from '@common-models/standard-file-storage.model';

export class CertificateHistoryTemplateFileModel {
  public id: string;

  public createTs: Date;

  public fileStorage: StandardFileStorageModel;

  public isActive: boolean;
}
