import { StandardNameIdModel } from '@common-models/standard-name-id.model';
import { NotificationTemplateTargetObjectTypeEnum } from '@notification-template-modals-create-update-steps-target-object-models/notification-template-target-object-type.enum';

export class NotificationTemplateTargetObjectModel extends StandardNameIdModel {
  public objectType: NotificationTemplateTargetObjectTypeEnum;
}
