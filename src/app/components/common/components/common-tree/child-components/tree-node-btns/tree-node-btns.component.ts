import { Component, EventEmitter, Injector, Input, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { EntityExceptionEnum } from '@common-models/response-exceptions/entity-exception.enum';
import { SnackBarTypeEnum } from '@common-models/snack-bar-type.enum';
import { StandardFlatNodeModel } from '@common-tree-models/standard-flat-node.model';
import { CommonTreeService } from '@common-tree-services/common-tree.service';
import { ResourceCheckErrorCauseModel } from '@event-models/resource-check-error-cause.model';
import { SnackbarInfoComponent } from '@event-snackbar-info/snackbar-info.component';

@Component({
  selector: 'app-tree-node-btns',
  templateUrl: './tree-node-btns.component.html',
  styleUrls: ['./tree-node-btns.component.scss'],
  standalone: false,
})
export class TreeNodeBtnsComponent extends CommonComponent {
  @Input() node: StandardFlatNodeModel;
  @Input() isSingleAddBtn?: boolean;
  @Input() urlService: string;
  @Input() openCreateUpdateModalFunc?: (
    node: StandardFlatNodeModel,
    isUpdate: boolean,
    urlService: string,
  ) => MatDialogRef<any, any>;
  @Input() mapCheckCrudBtnShowFuncMap?: Map<string, (btnName: string, node: StandardFlatNodeModel) => boolean>;
  @Output() updateTreeData = new EventEmitter();

  constructor(
    injector: Injector,
    private commonTreeService: CommonTreeService,
  ) {
    super(injector);
  }

  checkCreateBtnEnable(): boolean {
    return this.checkAdditionalFunc('create');
  }

  checkEditBtnEnable(): boolean {
    return !this.isSingleAddBtn && this.checkAdditionalFunc('edit');
  }

  checkDeleteBtnEnable(): boolean {
    return !(this.isSingleAddBtn || this.node?.level === 0) && this.checkAdditionalFunc('delete');
  }

  checkAdditionalFunc(btnName: string): boolean {
    const additionalCheckFunc: (btnName: string, node: StandardFlatNodeModel) => boolean =
      this.mapCheckCrudBtnShowFuncMap?.get(btnName);

    return additionalCheckFunc ? additionalCheckFunc(btnName, this.node) : true;
  }

  createOrUpdate(isUpdate: boolean): void {
    if (!this.openCreateUpdateModalFunc) {
      return;
    }

    const modalRef = this.openCreateUpdateModalFunc(this.node, isUpdate, this.urlService);

    this.createEditCloseModalHandler(modalRef);
  }

  createEditCloseModalHandler(modalRef: MatDialogRef<any>): void {
    modalRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateTreeData.emit();
      }
    });
  }

  remove(): void {
    this.openDeleteModal();
  }

  openDeleteModal(): void {
    const modalRef = this.showConfirmModal(
      this.localization.getLocalTextFromKey('treeRemoveNodeConfirmMessage'),
      this.localization.getLocalTextFromKey('treeCreateUpdateModalRemoveTitle'),
    );

    modalRef.afterClosed().subscribe(result => {
      if (result) {
        this.delete();
      }
    });
  }

  delete(): void {
    if (this.node?.id) {
      this.commonTreeService.delete(this.node, this.urlService).subscribe({
        next: data => {
          this.updateTreeData.emit();
        },
        error: e => {
          this.errorHandler(e);
        },
      });
    }
  }

  errorHandler(error: any): void {
    const errorBody = error.error,
      contents = errorBody.contents;
    const resourceCheckErrorCauseList: Array<ResourceCheckErrorCauseModel> = [];

    if (!contents || contents.length <= 0) {
      this.errorResponseHandler(error);
      return;
    }

    contents.forEach(content => {
      switch (content.type) {
        case EntityExceptionEnum.RESOURCE_CHECK_EXCEPTION_CONTENT: {
          resourceCheckErrorCauseList.push(...content.errorCauses);
          break;
        }
        default:
          this.errorResponseHandler(error);
      }
    });

    this.hideLoadPage();
    this.showEventCreateResourceBusySnackBar(resourceCheckErrorCauseList);
  }

  private showEventCreateResourceBusySnackBar(resourceCheckErrorCauseList: Array<ResourceCheckErrorCauseModel>): void {
    this.showSnackBarWithMessage(
      this.localization.getLocalTextFromKey('nodeBusySnackBarMessage'),
      SnackBarTypeEnum.ERROR,
      {
        timeOut: 0,
        toastComponent: SnackbarInfoComponent,
        payload: {
          data: resourceCheckErrorCauseList,
          self: this,
        },
      },
    );
  }
}
