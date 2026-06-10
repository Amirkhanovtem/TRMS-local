import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Injectable } from '@angular/core';
import { TreeSelectionTypeEnum } from '@common-tree-models/tree-selection-type.enum';
import { StandardFlatNodeModel } from '@components/common/components/common-tree/models/standard-flat-node.model';
import { MultiParentNodeSelectionService } from '@components/common/components/common-tree/services/selection/multi-parent-node-selection/multi-parent-node-selection.service';
import { OnlyChildSingleSelectionService } from '@components/common/components/common-tree/services/selection/only-child-single-selection/only-child-single-selection.service';
import { SingleParentNodeSelectionService } from '@components/common/components/common-tree/services/selection/single-parent-node-selection/single-parent-node-selection.service';
import { StandardMultiSelectionService } from '@components/common/components/common-tree/services/selection/standard-multi-selection/standard-multi-selection.service';
import { TreeSelectionInterface } from '@components/common/components/common-tree/services/selection/tree-selection.interface';

@Injectable({
  providedIn: 'root',
})
export class SelectionBuilderService {
  getSelectionServiceByTreeSelectionType(
    treeSelectionType: TreeSelectionTypeEnum,
    checklistSelection: SelectionModel<StandardFlatNodeModel>,
    treeControl: FlatTreeControl<StandardFlatNodeModel>,
  ): TreeSelectionInterface {
    switch (treeSelectionType) {
      case TreeSelectionTypeEnum.SINGLE_PARENT_NODE_SELECTION:
        return new SingleParentNodeSelectionService(checklistSelection, treeControl);
      case TreeSelectionTypeEnum.MULTI_PARENT_NODE_SELECTION:
        return new MultiParentNodeSelectionService(checklistSelection, treeControl);
      case TreeSelectionTypeEnum.STANDARD_MULTI_SELECTION:
        return new StandardMultiSelectionService(checklistSelection, treeControl);
      case TreeSelectionTypeEnum.ONLY_CHILD_SINGLE_SELECTION:
        return new OnlyChildSingleSelectionService(checklistSelection, treeControl);
      default:
        return new StandardMultiSelectionService(checklistSelection, treeControl);
    }
  }
}
