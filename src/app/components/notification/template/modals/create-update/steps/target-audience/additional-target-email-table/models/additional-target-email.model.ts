import { AdditionalEmailType } from '@notification-template-models-enums/additional-email-type.enum';

export class AdditionalTargetEmailModel {
  public id: string;
  public email: string;
  public type: AdditionalEmailType;
}
