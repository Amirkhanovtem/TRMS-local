import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { EntityExceptionEnum } from '@common-models/response-exceptions/entity-exception.enum';
import { SnackBarTypeEnum } from '@common-models/snack-bar-type.enum';
import { CommonDictionaryComponent } from '@dictionaries-common-crud/common-dictionary.component';

@Component({
  selector: 'app-crud-btns',
  templateUrl: './crud-btns.component.html',
  styleUrls: ['./crud-btns.component.scss', '../../../../../styles.scss'],
  standalone: false,
})
export class CrudBtnsComponent extends CommonDictionaryComponent {
  @Input() viewComponent;
  @Input() createUpdateComponent;
  @Input() parentSelection: SelectionModel<any>;
  @Input() service;
  @Input() checkShowCrudBtnFunc: Map<string, (btnName: string) => boolean>;
  @Input() mapCheckCrudBtnDisableFunc: Map<string, (btnName: string) => boolean>;
  @Output() loadData = new EventEmitter();

  public deleteConfirmMessage: string = this.localization.getLocalTextFromKey('deleteRowConfirmTitle');

  override checkShowBtn(btnName: string): boolean {
    const checkShowFunc: (btnName: string) => boolean = this.checkShowCrudBtnFunc?.get(btnName);

    return checkShowFunc ? checkShowFunc(btnName) : super.checkShowBtn(btnName);
  }

  public checkBtnDisable(btnName: string): boolean {
    const checkDisableFunc: (btnName: string) => boolean = this.mapCheckCrudBtnDisableFunc?.get(btnName);

    return checkDisableFunc ? checkDisableFunc(btnName) : this.defaultCheckBtnDisable(btnName);
  }

  private defaultCheckBtnDisable(btnName: string): boolean {
    switch (btnName) {
      case 'create': {
        return false;
      }
      case 'delete': {
        return !this.parentSelection.hasValue();
      }
      case 'edit':
      case 'audit':
      case 'view': {
        return !this.isOneRowSelected();
      }
      default: {
        return true;
      }
    }
  }

  openCreateModal(): void {
    const modalRef = this.newModal.open(this.createUpdateComponent);
    this.closeModalHandler(modalRef);
  }

  openUpdateModal(): void {
    const selected = this.parentSelection?.selected;

    if (selected.length == 1) {
      const modalRef = this.newModal.open(this.createUpdateComponent, {
        data: {
          model: selected[0],
          isUpdate: true,
        },
      });

      this.closeModalHandler(modalRef);
    }
  }

  openViewModal(): void {
    const selected = this.parentSelection?.selected;

    if (selected.length == 1) {
      this.newModal.open(this.viewComponent, {
        data: {
          model: selected[0],
          isView: true,
        },
      });
    }
  }

  closeModalHandler(modalRef: MatDialogRef<any>): void {
    modalRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData.emit();
      }
    });
  }

  openDeleteModal(): void {
    const modalRef = this.showConfirmModal(this.deleteConfirmMessage);

    modalRef.afterClosed().subscribe(result => {
      if (result) {
        this.delete();
      }
    });
  }

  delete(): void {
    const listId: Array<string> = this.parentSelection?.selected.map(object => object.id);

    this.service.delete(listId).subscribe(
      data => this.loadData.emit(),
      error => this.errorDeleteHandler(error),
    );
  }

  isOneRowSelected(): boolean {
    return this.parentSelection?.selected.length == 1;
  }

  errorDeleteHandler(error): void {
    const errorBody = error.error,
      contents = errorBody.contents;

    if (!contents || contents.length <= 0) {
      this.errorResponseHandler(error);
      return;
    }

    contents.forEach(content => {
      switch (content.type) {
        case EntityExceptionEnum.DELETION_CHECK_EXCEPTION_CONTENT: {
          this.showSnackBarWithMessage(content.message, SnackBarTypeEnum.ERROR);
          break;
        }
        default:
          this.errorResponseHandler(error);
      }
    });

    this.hideLoadPage();
  }

  getSingleSelectedId(): string {
    const selected = this.parentSelection?.selected;

    if (selected.length == 1) {
      return selected[0]['id'];
    } else {
      return null;
    }
  }
}
