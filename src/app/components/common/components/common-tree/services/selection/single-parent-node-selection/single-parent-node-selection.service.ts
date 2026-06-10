import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Injectable } from '@angular/core';
import { CommonTreeSelectionService } from '@common-tree-services/selection/common-tree-selection.service';
import { StandardFlatNodeModel } from '@components/common/components/common-tree/models/standard-flat-node.model';
import { TreeSelectionInterface } from '@components/common/components/common-tree/services/selection/tree-selection.interface';

@Injectable({
  providedIn: 'root',
})
export class SingleParentNodeSelectionService extends CommonTreeSelectionService implements TreeSelectionInterface {
  constructor(
    private checklistSelection: SelectionModel<StandardFlatNodeModel>,
    treeControl: FlatTreeControl<StandardFlatNodeModel>,
  ) {
    super(treeControl);
  }

  changeNodeHandler(node: StandardFlatNodeModel): void {
    this.selectNode(node);
  }

  changeNodeLeafHandler(node: StandardFlatNodeModel): void {
    this.selectNode(node);
  }

  isDisabled(node: StandardFlatNodeModel): boolean {
    if (this.checklistSelection.isEmpty() || !this.checklistSelection.isSelected(node)) return false;

    const parentNode = this.getParentNode(node, this.treeControl);

    return parentNode !== null && this.checklistSelection.isSelected(parentNode);
  }

  checkNode(node: StandardFlatNodeModel): boolean {
    return this.checklistSelection.isSelected(node);
  }

  checkNodeLeaf(node: StandardFlatNodeModel): boolean {
    return this.checklistSelection.isSelected(node);
  }

  checkIndeterminate(node: StandardFlatNodeModel): boolean {
    const descendants = this.getDescendants(node);

    return (
      descendants.some(descendant => this.checklistSelection.isSelected(descendant)) &&
      !this.checklistSelection.isSelected(node)
    );
  }

  getSelectedNodes(): Array<StandardFlatNodeModel> {
    return this.checklistSelection.selected;
  }

  selectNode(node: StandardFlatNodeModel): void {
    if (!this.checklistSelection.isSelected(node)) {
      this.checklistSelection.clear();
    }

    this.checklistSelection.toggle(node);

    const descendants = this.getDescendants(node, true);

    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
  }
}
