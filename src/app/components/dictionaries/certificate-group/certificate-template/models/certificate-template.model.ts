import { CertificateDurationSettingsModel } from '@certificate-template-models/certificate-duration-settings.model';
import { WithFileStorageInterface } from '@common-input-file-models/withFileStorage.interface';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { StandardFileStorageModel } from '@common-models/standard-file-storage.model';
import { StandardNameIdModel } from '@common-models/standard-name-id.model';

export class CertificateTemplateModel implements WithFileStorageInterface {
  public id: string = null;
  public name: string = null;
  public code: string = null;
  public description: string = null;
  public certificateDurationSettings: CertificateDurationSettingsModel = new CertificateDurationSettingsModel();
  public prefixCode: string = null;
  public type: StandardEnumModel;
  public fileStorage: StandardFileStorageModel = new StandardFileStorageModel();
  public trainingCategory: StandardNameIdModel = null;
  public trainingTemplate: StandardNameIdModel = null;
}
