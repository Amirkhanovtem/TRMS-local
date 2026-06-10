import { CertificateTemplateModel } from '@certificate-template-models/certificate-template.model';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { TrainingTemplateModel } from '@training-template-models/training-template.model';

export class CertificateForReissueModel {
  public id: string;
  public certificateTemplateModel: CertificateTemplateModel;
  public trainingTemplateModel: TrainingTemplateModel;
  public certificateStatus: StandardEnumModel;
  public dateOfIssue: Date;
  public dateOfExpire: Date;
}
