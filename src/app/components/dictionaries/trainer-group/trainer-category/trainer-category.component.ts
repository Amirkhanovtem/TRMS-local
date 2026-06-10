import { Component, Injector } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DefaultCreateUpdateTreeNodeModalComponent } from '@common-tree-modals-default-create-update/default-create-update-tree-node-modal.component';
import { StandardFlatNodeModel } from '@common-tree-models/standard-flat-node.model';
import { CommonDictionaryComponent } from '@dictionaries-common-crud/common-dictionary.component';
import { TrainerCategoryService } from '@trainer-category-services/trainer-category.service';

@Component({
  selector: 'app-trainer-category',
  templateUrl: './trainer-category.component.html',
  styleUrls: ['./trainer-category.component.scss', '../../../../../styles.scss'],
  standalone: false,
})
export class TrainerCategoryComponent extends CommonDictionaryComponent {
  urlService: string = '/trainer-categories';

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
    public trainerCategoryService: TrainerCategoryService,
  ) {
    super(injector);
  }
}
