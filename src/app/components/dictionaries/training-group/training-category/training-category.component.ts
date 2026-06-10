import { Component, Injector } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DefaultCreateUpdateTreeNodeModalComponent } from '@common-tree-modals-default-create-update/default-create-update-tree-node-modal.component';
import { StandardFlatNodeModel } from '@common-tree-models/standard-flat-node.model';
import { CommonDictionaryComponent } from '@dictionaries-common-crud/common-dictionary.component';
import { TrainingCategoryService } from '@training-category-services/training-category.service';

@Component({
  selector: 'app-training-category',
  templateUrl: './training-category.component.html',
  styleUrls: ['./training-category.component.scss', '../../../../../styles.scss'],
  standalone: false,
})
export class TrainingCategoryComponent extends CommonDictionaryComponent {
  urlService: string = '/training-categories';

  openCreateUpdateModalFunc = (
    node: StandardFlatNodeModel,
    isUpdate: boolean,
    urlService: string,
  ): MatDialogRef<DefaultCreateUpdateTreeNodeModalComponent, any> => {
    return this.newModal.open(DefaultCreateUpdateTreeNodeModalComponent, {
      data: {
        model: node,
        urlService: urlService,
        isUpdate: isUpdate,
      },
    });
  };

  constructor(
    injector: Injector,
    public trainingCategoryService: TrainingCategoryService,
  ) {
    super(injector);
  }
}
