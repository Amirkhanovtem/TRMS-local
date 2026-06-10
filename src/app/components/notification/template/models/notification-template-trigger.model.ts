import { StandardEnumModel } from '@common-models/standard-enum.model';

export class NotificationTemplateTriggerModel extends StandardEnumModel {
  public type: string;
  public targetType: string;
}
