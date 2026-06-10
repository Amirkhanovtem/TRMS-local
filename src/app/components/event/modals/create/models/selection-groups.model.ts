import { StandardNameIdModel } from '@common-models/standard-name-id.model';

export class SelectionGroupsModel {
  order: number;
  name: string;
  selection: Array<StandardNameIdModel> = [];

  constructor(order: number, name: string) {
    this.order = order;
    this.name = name;
  }
}
