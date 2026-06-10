import { StandardNameIdModel } from '@common-models/standard-name-id.model';

export class DragOrderModel extends StandardNameIdModel {
  public orderNumber: number = null;
  public dontOrder: boolean = false;
}
