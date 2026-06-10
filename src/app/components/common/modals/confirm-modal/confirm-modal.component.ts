import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { Localization } from '@localization/localization';

@Component({
  selector: 'app-close-modal-confirm',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss', '../../../../../styles.scss'],
  standalone: false,
})
export class ConfirmModalComponent implements AfterViewInit {
  @ViewChild('modal') modalComponent: CommonModalComponent;

  defaultConfirmTitle: string = this.localization.getLocalTextFromKey('confirmModalTitle');
  defaultConfirmBtnTitle: string = this.localization.getLocalTextFromKey('confirmBtn');
  defaultCancelBtnTitle: string = this.localization.getLocalTextFromKey('cancelBtn');

  constructor(
    public localization: Localization,
    @Inject(MAT_DIALOG_DATA)
    public dialogParams: {
      message?: string;
      title?: string;
      confirmBtnTitle?: string;
      cancelBtnTitle?: string;
    },
  ) {}

  ngAfterViewInit(): void {
    this.modalComponent.changeCloseWithoutConfirmField(true);
  }

  confirm(): void {
    this.modalComponent.modal.close(true);
  }

  cancel(): void {
    this.modalComponent.modal.close(false);
  }
}
