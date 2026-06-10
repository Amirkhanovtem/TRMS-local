import { Component, Inject, Injector, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { NotificationTemplateTableModel } from '@notification-template-modals-selection-models/notification-template-table.model';
import { NotificationTemplateTriggerTargetTypeEnum } from '@notification-template-models-enums/notification-template-trigger-target-type.enum';
import { NotificationTemplateService } from '@notification-template-services/notification-template.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-notification-template-modal',
  templateUrl: './notification-template-modal.component.html',
  styleUrls: ['./notification-template-modal.component.scss', '../../../../../../styles.scss'],
  standalone: false,
})
export class NotificationTemplateModalComponent extends CommonComponent {
  @ViewChild('modal') modalComponent: CommonModalComponent;

  public dataSourceObs: Observable<Array<NotificationTemplateTableModel>>;

  constructor(
    injector: Injector,
    public notificationTemplateService: NotificationTemplateService,
    @Inject(MAT_DIALOG_DATA)
    public dialogParams: {
      targetTemplateId: string;
      targetType: NotificationTemplateTriggerTargetTypeEnum;
    },
  ) {
    super(injector);
    this.dataSourceObs = notificationTemplateService.listByTargetTemplateIdAndType(
      this.dialogParams?.targetTemplateId,
      this.dialogParams?.targetType,
    );
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.modalComponent.changeCloseWithoutConfirmField(true);
  }
}
