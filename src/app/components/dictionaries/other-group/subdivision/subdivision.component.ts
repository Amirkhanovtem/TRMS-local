import { Component, Injector } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DefaultCreateUpdateTreeNodeModalComponent } from '@common-tree-modals-default-create-update/default-create-update-tree-node-modal.component';
import { StandardFlatNodeModel } from '@common-tree-models/standard-flat-node.model';
import { CommonDictionaryComponent } from '@dictionaries-common-crud/common-dictionary.component';
import { SubdivisionService } from '@subdivision-services/subdivision.service';

@Component({
  selector: 'app-sub-division',
  templateUrl: './subdivision.component.html',
  styleUrls: ['./subdivision.component.scss', '../../../../../styles.scss'],
  standalone: false,
})
export class SubdivisionComponent extends CommonDictionaryComponent {
  urlService: string = '/subdivisions';

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
        isMultiLanguage: true,
      },
    });
  };

  constructor(
    injector: Injector,
    public subdivisionService: SubdivisionService,
  ) {
    super(injector);
  }
}
