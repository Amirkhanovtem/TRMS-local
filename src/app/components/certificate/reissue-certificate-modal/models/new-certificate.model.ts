import { CertificateTemplateModel } from '@certificate-template-models/certificate-template.model';
import { CertificateSerialNumberInfoModel } from '@components/certificate/certificate/models/certificate-serial-number-info.model';
import { TrainingCardModel } from '@participation-card-models/training-card.model';

export class NewCertificateModel {
  public id: string;

  public certificateTemplate: CertificateTemplateModel;

  public participantCard: TrainingCardModel;

  public dateOfIssue: Date;

  public dateOfExpire: Date;

  public serialNumberInfo: CertificateSerialNumberInfoModel;
}
