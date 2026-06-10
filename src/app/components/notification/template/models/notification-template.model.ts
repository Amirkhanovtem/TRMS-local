import { StandardEnumModel } from '@common-models/standard-enum.model';
import { StandardFileStorageModel } from '@common-models/standard-file-storage.model';
import { StandardNameIdModel } from '@common-models/standard-name-id.model';
import { AdditionalTargetEmailModel } from '@notification-template-modals-create-update-steps-target-audience-add-target-email-table-models/additional-target-email.model';
import { NotificationTemplateTargetObjectModel } from '@notification-template-modals-create-update-steps-target-object-models/notification-template-target-object.model';
import { NotificationTemplateTriggerModel } from '@notification-template-models/notification-template-trigger.model';

export class NotificationTemplateModel extends StandardNameIdModel {
  public code: string = null;
  public description: string = null;
  public trigger: NotificationTemplateTriggerModel = null;

  public targetObjects: Array<NotificationTemplateTargetObjectModel> = [];

  public sendingType: StandardEnumModel = null;
  public offsetCount: number = null;
  public offsetType: StandardEnumModel = null;
  public mainSendingTime: string = null;
  public isRepeatable: boolean = false;
  public repeatCount: number = null;
  public repeatType: StandardEnumModel = null;
  public repeatDayPeriod: number = null;
  public repeatDayOfWeek: Array<number> = [];
  public repeatSendingTime: string = null;

  public mainTargetAudience: Array<StandardEnumModel> = [];
  public copyTargetAudience: Array<StandardEnumModel> = [];
  public additionalTargetEmails: Array<AdditionalTargetEmailModel> = [];

  public from: string = null;
  public subject: string = null;
  public body: string = null;
  public fileStorages: Array<StandardFileStorageModel> = [];

  public saveAsDraft: boolean = false;
  public status: StandardEnumModel = null;
}
