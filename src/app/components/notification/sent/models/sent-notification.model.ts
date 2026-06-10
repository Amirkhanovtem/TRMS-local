import { StandardEnumModel } from '@common-models/standard-enum.model';
import { StandardNameIdModel } from '@common-models/standard-name-id.model';
import { NotificationTemplateTriggerModel } from '@notification-template-models/notification-template-trigger.model';

export class SentNotificationModel extends StandardNameIdModel {
  public trigger: NotificationTemplateTriggerModel = null;
  public sendStatus: StandardEnumModel = null;
  public senderEmail: string = null;
  public receiver: string = null;
  public body: string = null;
}
