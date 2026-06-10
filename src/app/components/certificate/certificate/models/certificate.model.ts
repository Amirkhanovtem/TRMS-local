import { CertificateDurationSettingsModel } from '@certificate-template-models/certificate-duration-settings.model';
import { CertificateTemplateModel } from '@certificate-template-models/certificate-template.model';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { StandardNameIdModel } from '@common-models/standard-name-id.model';
import { CertificateSerialNumberInfoModel } from '@components/certificate/certificate/models/certificate-serial-number-info.model';
import { TrainingCardModel } from '@participation-card-models/training-card.model';

export class CertificateModel extends StandardNameIdModel {
  public code: string = null;
  public dateOfIssue: Date = null;
  public dateOfExpire: Date = null;
  public participantTrainingCard: TrainingCardModel = new TrainingCardModel();
  public certificateTemplate: CertificateTemplateModel = new CertificateTemplateModel();
  public certificateData: Map<string, string> = null;
  public serialNumberInfo: CertificateSerialNumberInfoModel = new CertificateSerialNumberInfoModel();
  public reissuedByCertificate: CertificateModel = null;
  public reissuedCertificates: Set<CertificateModel> = null;
  public certificateStatus: StandardEnumModel = new StandardEnumModel();
  public certificateDurationSettings: CertificateDurationSettingsModel = new CertificateDurationSettingsModel();
}
