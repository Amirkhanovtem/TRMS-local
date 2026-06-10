import { StandardTreeModel } from '@common-tree-models/standard-tree.model';

export class StandardFlatNodeModel extends StandardTreeModel {
  expandable: boolean;
  level: number;
  showBtns: boolean = false;
}
