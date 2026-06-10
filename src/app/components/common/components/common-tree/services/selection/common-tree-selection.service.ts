import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { StandardFlatNodeModel } from '@components/common/components/common-tree/models/standard-flat-node.model';

export class CommonTreeSelectionService {
  constructor(protected treeControl: FlatTreeControl<StandardFlatNodeModel>) {}

  checkNodeOrSomeParentSelected(
    node: StandardFlatNodeModel,
    checklistSelection: SelectionModel<StandardFlatNodeModel>,
  ): boolean {
    if (checklistSelection.isSelected(node)) {
      return true;
    }

    return this.checkSomeParentSelected(node, checklistSelection);
  }

  checkSomeParentSelected(
    node: StandardFlatNodeModel,
    checklistSelection: SelectionModel<StandardFlatNodeModel>,
  ): boolean {
    let parent: StandardFlatNodeModel = this.getParentNode(node, this.treeControl);

    while (parent) {
      if (checklistSelection.isSelected(parent)) {
        return true;
      }

      parent = this.getParentNode(parent, this.treeControl);
    }

    return false;
  }

  getParentNode(
    node: StandardFlatNodeModel,
    treeControl: FlatTreeControl<StandardFlatNodeModel>,
  ): StandardFlatNodeModel | null {
    const currentLevel = node.level;

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = treeControl.dataNodes[i];

      if (currentNode.level < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  getDescendants(node: StandardFlatNodeModel, onlySelectable?: boolean) {
    const nodes = this.treeControl.getDescendants(node);

    if (onlySelectable) {
      return nodes.filter(node => node.selectable);
    }

    return nodes;
  }
}
