import { StandardEnumModel } from '@common-models/standard-enum.model';
import { StandardNameIdModel } from '@common-models/standard-name-id.model';
import { NotificationTemplateTriggerModel } from '@notification-template-models/notification-template-trigger.model';
import { NotificationTemplateTypeEnum } from '@notification-template-models-enums/notification-template-type.enum';

export class NotificationTemplateTableModel extends StandardNameIdModel {
  public code: string = null;
  public description: string = null;
  public trigger: NotificationTemplateTriggerModel = null;
  public status: StandardEnumModel = null;
  public type: NotificationTemplateTypeEnum = null;
  public createdBy: string = null;
}
