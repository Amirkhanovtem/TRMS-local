import { StandardNameIdModel } from '@common-models/standard-name-id.model';

export class CertificateTemplateGroupModel {
  public id: string = '';
  public name: string = '';
  public code: string = '';
  public description: string = '';
  public certificateTemplates: Array<StandardNameIdModel> = [];
}
