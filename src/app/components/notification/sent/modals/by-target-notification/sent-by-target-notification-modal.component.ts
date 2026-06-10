import { Component, Inject, Injector, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { SentNotificationService } from '@notification-sent-services/sent-notification.service';

@Component({
  selector: 'app-sent-by-target-notification-modal',
  templateUrl: './sent-by-target-notification-modal.component.html',
  styleUrls: ['./sent-by-target-notification-modal.component.scss', '../../../../../../styles.scss'],
  standalone: false,
})
export class SentByTargetNotificationModalComponent extends CommonComponent {
  @ViewChild('modal') modalComponent: CommonModalComponent;

  constructor(
    injector: Injector,
    public sentNotificationService: SentNotificationService,
    @Inject(MAT_DIALOG_DATA)
    public dialogParams: {
      targetId: string;
    },
  ) {
    super(injector);
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.modalComponent.changeCloseWithoutConfirmField(true);
  }
}
