import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Injectable } from '@angular/core';
import { CommonTreeSelectionService } from '@common-tree-services/selection/common-tree-selection.service';
import { StandardFlatNodeModel } from '@components/common/components/common-tree/models/standard-flat-node.model';
import { TreeSelectionInterface } from '@components/common/components/common-tree/services/selection/tree-selection.interface';

@Injectable({
  providedIn: 'root',
})
export class StandardMultiSelectionService extends CommonTreeSelectionService implements TreeSelectionInterface {
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
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  isDisabled(node: StandardFlatNodeModel): boolean {
    return false;
  }

  checkNode(node: StandardFlatNodeModel): boolean {
    return this.checklistSelection.isSelected(node) || this.allChildChecked(node);
  }

  checkNodeLeaf(node: StandardFlatNodeModel): boolean {
    return this.checklistSelection.isSelected(node);
  }

  checkIndeterminate(node: StandardFlatNodeModel): boolean {
    const someChildSelected = this.getDescendants(node).some(child => this.checkNode(child));

    return someChildSelected && !this.allChildChecked(node);
  }

  getSelectedNodes(): Array<StandardFlatNodeModel> {
    return this.checklistSelection.selected;
  }

  /**
   * Checks all the parents when a leaf node is selected/unselected
   */
  checkAllParentsSelection(node: StandardFlatNodeModel): void {
    let parent: StandardFlatNodeModel | null = this.getParentNode(node, this.treeControl);

    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent, this.treeControl);
    }
  }

  /**
   * Check root node checked state and change it accordingly
   */
  checkRootNodeSelection(node: StandardFlatNodeModel): void {
    const nodeSelected: boolean = this.checklistSelection.isSelected(node),
      allChildChecked: boolean = this.allChildChecked(node);

    if (nodeSelected && !allChildChecked) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && allChildChecked) {
      this.checklistSelection.select(node);
    }
  }

  selectNode(node: StandardFlatNodeModel): void {
    const child = this.getDescendants(node, true);

    if (this.checkNode(node)) {
      this.checklistSelection.deselect(node);
      this.checklistSelection.deselect(...child);
    } else {
      this.checklistSelection.select(node);
      this.checklistSelection.select(...child);
    }

    this.checkAllParentsSelection(node);
  }

  allChildChecked(node: StandardFlatNodeModel): boolean {
    const descendants = this.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every(child => {
        return this.checkNode(child);
      });

    return descAllSelected;
  }
}
