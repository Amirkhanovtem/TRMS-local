import { Component, Inject, Injector, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { SearchComponent } from '@common-search/search.component';
import { TargetNotificationTemplateModalComponent } from '@notification-target-modals-notification-template/target-notification-template-modal.component';
import { NotificationTargetModel } from '@notification-target-models/notification-target.model';
import { SendNotificationBodyModel } from '@notification-target-models/send-notification-body.model';
import { TargetNotificationTemplateService } from '@notification-target-services/target-notification-template.service';
import { NotificationTemplateTableModel } from '@notification-template-modals-selection-models/notification-template-table.model';
import { NotificationTemplateTriggerEnum } from '@notification-template-models-enums/notification-template-trigger.enum';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-target-list',
  templateUrl: './target-list.component.html',
  styleUrls: ['./target-list.component.scss', '../../../../../../styles.scss'],
  standalone: false,
})
export class TargetListComponent extends CommonComponent {
  public targetDataSource: Array<NotificationTargetModel> = [];

  @ViewChild(SearchComponent) searchComponent: SearchComponent;

  constructor(
    injector: Injector,
    private eventNotificationTemplateService: TargetNotificationTemplateService,
    @Inject(MAT_DIALOG_DATA)
    public dialogParams: {
      targets: Array<NotificationTargetModel>;
      trigger: NotificationTemplateTriggerEnum;
      sendNotificationBodyModel: SendNotificationBodyModel;
    },
  ) {
    super(injector);
    this.targetDataSource = this.dialogParams.targets;
  }

  applySearch(): void {
    const search = this.searchComponent?.search?.toLowerCase(),
      loadedData: Array<NotificationTargetModel> = this.dialogParams?.targets;

    this.targetDataSource = !loadedData ? [] : loadedData.filter(target => target.name.toLowerCase().includes(search));
  }

  openEvenNotificationTableModal(target: NotificationTargetModel): void {
    const targetId: string = target.id,
      targetName: string = target.name,
      trigger: NotificationTemplateTriggerEnum = this.dialogParams?.trigger,
      dataSourceObs: Observable<Array<NotificationTemplateTableModel>> =
        this.eventNotificationTemplateService.findAllNotificationTemplateByTrainingIdAndTrigger(targetId, trigger),
      matDialogRef = this.newModal.open(TargetNotificationTemplateModalComponent, {
        data: {
          targetId: targetId,
          targetName: targetName,
          dataSourceObs: dataSourceObs,
          sendingForm: true,
        },
      }),
      eventNotificationTemplateModalComponent: TargetNotificationTemplateModalComponent =
        matDialogRef.componentInstance;

    eventNotificationTemplateModalComponent.sendNotification.subscribe({
      next: data => {
        this.sendSelectedNotificationTemplatesByTrainingAndTrigger(
          target,
          trigger,
          data,
          eventNotificationTemplateModalComponent,
        );
      },
    });
  }

  private sendSelectedNotificationTemplatesByTrainingAndTrigger(
    target: NotificationTargetModel,
    trigger: NotificationTemplateTriggerEnum,
    selectedNotificationTemplateIds: Array<string>,
    eventNotificationTemplateModalComponent: TargetNotificationTemplateModalComponent,
  ): void {
    const sendBody: SendNotificationBodyModel =
      this.dialogParams.sendNotificationBodyModel ?? new SendNotificationBodyModel();
    sendBody.selectedNotificationTemplateIds = selectedNotificationTemplateIds;

    this.eventNotificationTemplateService
      .sendSelectedNotificationTemplatesByTrainingAndTrigger(target.id, trigger, sendBody)
      .subscribe({
        next: data => {
          eventNotificationTemplateModalComponent.modalComponent.closeCurrentModal(true);
          target.isSended = true;
        },
        error: e => {
          eventNotificationTemplateModalComponent.errorResponseHandler(e);
        },
      });
  }
}
