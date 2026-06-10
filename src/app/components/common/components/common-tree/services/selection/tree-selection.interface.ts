import { StandardFlatNodeModel } from '@components/common/components/common-tree/models/standard-flat-node.model';

export interface TreeSelectionInterface {
  changeNodeHandler(node: StandardFlatNodeModel): void;

  changeNodeLeafHandler(node: StandardFlatNodeModel): void;

  isDisabled(node: StandardFlatNodeModel): boolean;

  checkNode(node: StandardFlatNodeModel): boolean;

  checkNodeLeaf(node: StandardFlatNodeModel): boolean;

  checkIndeterminate(node: StandardFlatNodeModel): boolean;

  getSelectedNodes(): Array<StandardFlatNodeModel>;
}
