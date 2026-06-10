import { Injector } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';

export class CommonCloseableModalComponents<T> extends CommonComponent {
  public modal: MatDialogRef<T>;

  protected closeWithoutConfirm: boolean = false;

  constructor(injector: Injector) {
    super(injector);
    this.modal = injector.get(MatDialogRef<T>);
    this.closeModalHandler();
  }

  protected closeModalHandler(): void {
    this.modal.disableClose = true;

    this.modal.backdropClick().subscribe(data => this.closeHandler());
  }

  private closeHandler(): void {
    if (this.closeWithoutConfirm) {
      this.closeCurrentModal(false);
    } else {
      this.openCloseModalConfirm();
    }
  }

  public closeBtnAction(): void {
    this.closeHandler();
  }

  private openCloseModalConfirm(): void {
    const message: string = this.localization.getLocalTextFromKey('closeModalConfirmTitle'),
      matDialogRef = this.showConfirmModal(message);

    matDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.closeCurrentModal(false);
      }
    });
  }

  public closeCurrentModal(result: any): void {
    this.hideLoadPage();
    this.modal.close(result);
  }

  public changeCloseWithoutConfirmField(newValue: boolean): void {
    this.closeWithoutConfirm = newValue;
  }
}
