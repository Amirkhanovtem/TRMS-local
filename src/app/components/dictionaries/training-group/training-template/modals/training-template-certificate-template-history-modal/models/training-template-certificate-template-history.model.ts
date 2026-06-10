import { StandardNameIdModel } from '@common-models/standard-name-id.model';

export class TrainingTemplateCertificateTemplateHistoryModel {
  public id: string;
  public createdBy: string;
  public createTs: Date;
  public certificateTemplate: StandardNameIdModel;
}
