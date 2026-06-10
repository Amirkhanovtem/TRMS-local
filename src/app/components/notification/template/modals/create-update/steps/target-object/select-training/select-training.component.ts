import { Component, Injector, Input, ViewChild } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { CommonTreeComponent } from '@common-tree/common-tree.component';
import { StandardFlatNodeModel } from '@common-tree-models/standard-flat-node.model';
import { TreeSelectionTypeEnum } from '@common-tree-models/tree-selection-type.enum';
import { CreateUpdateNotificationTemplateModalComponent } from '@notification-template-modals-create-update/create-update-notification-template-modal.component';
import { NotificationTemplateTargetObjectModel } from '@notification-template-modals-create-update-steps-target-object-models/notification-template-target-object.model';
import { NotificationTemplateTargetObjectTypeEnum } from '@notification-template-modals-create-update-steps-target-object-models/notification-template-target-object-type.enum';
import { TrainingCategoryService } from '@training-category-services/training-category.service';

@Component({
  selector: 'app-select-training',
  templateUrl: './select-training.component.html',
  styleUrls: ['./select-training.component.scss', '../../../../../../../../../styles.scss'],
  standalone: false,
})
export class SelectTrainingComponent extends CommonComponent {
  @Input() parent: CreateUpdateNotificationTemplateModalComponent;
  @ViewChild(CommonTreeComponent) commonTreeComponent: CommonTreeComponent;
  public treeSelectionType: TreeSelectionTypeEnum = TreeSelectionTypeEnum.MULTI_PARENT_NODE_SELECTION;

  constructor(
    injector: Injector,
    public trainingCategoryService: TrainingCategoryService,
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.commonTreeComponent.checklistSelection.changed.subscribe(data => this.changeTargetObjectHandler());
  }

  getSelectedNodesId(): Array<string> {
    return this.parent.notificationTemplate.targetObjects?.map(obj => obj.id);
  }

  changeTargetObjectHandler(): void {
    const selections: Array<StandardFlatNodeModel> = this.commonTreeComponent.getSelectedNodes(),
      selectedParents: Array<StandardFlatNodeModel> = selections.filter(node => {
        return !selections.find(parentNode => {
          return parentNode.id === node.parentId;
        });
      });

    this.parent.notificationTemplate.targetObjects = selectedParents.map(selection => {
      return SelectTrainingComponent._transformer(selection);
    });
  }

  private static _transformer(node: StandardFlatNodeModel): NotificationTemplateTargetObjectModel {
    const notificationTemplateTargetObject: NotificationTemplateTargetObjectModel =
      new NotificationTemplateTargetObjectModel();
    notificationTemplateTargetObject.id = node.id;
    notificationTemplateTargetObject.name = node.name;
    notificationTemplateTargetObject.objectType = node.unextendable
      ? NotificationTemplateTargetObjectTypeEnum.TRAINING_TEMPLATE
      : NotificationTemplateTargetObjectTypeEnum.TRAINING_CATEGORY;

    return notificationTemplateTargetObject;
  }
}
