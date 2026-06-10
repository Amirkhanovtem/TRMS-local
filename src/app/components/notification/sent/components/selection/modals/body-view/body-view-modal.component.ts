import { Component, Inject, Injector, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { JoditService } from '@jodit/jodit.service';
import { JoditAngularComponent } from 'jodit-angular';

@Component({
  selector: 'app-body-view-modal',
  templateUrl: './body-view-modal.component.html',
  styleUrls: ['./body-view-modal.component.scss', '../../../../../../../../styles.scss'],
  standalone: false,
})
export class BodyViewModalComponent extends CommonComponent {
  @ViewChild(JoditAngularComponent) jodit: JoditAngularComponent;
  @ViewChild('modal') modalComponent: CommonModalComponent;

  constructor(
    injector: Injector,
    private joditService: JoditService,
    @Inject(MAT_DIALOG_DATA)
    public dialogParams: {
      body?: string;
    },
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.setJoditConfig();
    this.modalComponent.changeCloseWithoutConfirmField(true);
  }

  setJoditConfig(): void {
    this.jodit.config = {
      toolbarAdaptive: false,
      readonly: true,
      uploader: {
        insertImageAsBase64URI: true,
      },
      minHeight: 500,
      buttons: this.joditService.getBtnsForView(),
    };
  }
}
