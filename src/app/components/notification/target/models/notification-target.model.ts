import { StandardNameIdModel } from '@common-models/standard-name-id.model';

export class NotificationTargetModel extends StandardNameIdModel {
  public isSended: boolean = false;
}
