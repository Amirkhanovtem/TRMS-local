import { Component, Inject, Injector, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { StandardNameIdModel } from '@common-models/standard-name-id.model';
import { CommonTreeComponent } from '@common-tree/common-tree.component';
import { StandardFlatNodeModel } from '@common-tree-models/standard-flat-node.model';
import { StandardTreeModel } from '@common-tree-models/standard-tree.model';
import { TreeSelectionTypeEnum } from '@common-tree-models/tree-selection-type.enum';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-common-tree-selection-modal',
  templateUrl: './common-tree-selection-modal.component.html',
  styleUrls: ['./common-tree-selection-modal.component.scss'],
  standalone: false,
})
export class CommonTreeSelectionModalComponent extends CommonComponent {
  @ViewChild(CommonTreeComponent) commonTreeComponent: CommonTreeComponent;
  @ViewChild('modal') modalComponent: CommonModalComponent;

  constructor(
    injector: Injector,
    @Inject(MAT_DIALOG_DATA)
    public dialogParams: {
      selectedNodesId?: Array<string>;
      loadTreeDataObs: Observable<Array<StandardTreeModel>>;
      modalTitle: string;
      treeSelectionType: TreeSelectionTypeEnum;
      isView: boolean;
      customSaveFunc?: (
        selectedNodes: Array<StandardFlatNodeModel>,
        modalRef: MatDialogRef<CommonModalComponent>,
        self: Component,
      ) => any;
      parentComponent?: Component;
    },
  ) {
    super(injector);
  }

  save(): void {
    if (this.dialogParams.customSaveFunc) {
      this.dialogParams.customSaveFunc(
        this.commonTreeComponent.getSelectedNodes(),
        this.modalComponent.modal,
        this.dialogParams.parentComponent,
      );
    } else {
      this.defaultSave();
    }
  }

  defaultSave(): void {
    this.modalComponent.modal.close({
      result: this.commonTreeComponent.getSelectedNodes(),
    });
  }

  getMinLevelNode(selectedInHierarchy: Array<StandardFlatNodeModel>): StandardNameIdModel {
    if (!selectedInHierarchy || selectedInHierarchy.length === 0) {
      return null;
    }

    const minLevelNode = selectedInHierarchy.reduce((prev, current) => {
      return prev.level < current.level ? prev : current;
    });

    const newMinLevelNodeModel: StandardNameIdModel = new StandardNameIdModel();
    newMinLevelNodeModel.id = minLevelNode.id;
    newMinLevelNodeModel.name = minLevelNode.name ? minLevelNode.name : minLevelNode[this.localEnumField];

    return newMinLevelNodeModel;
  }
}
