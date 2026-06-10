import { Component, EventEmitter, Inject, Injector, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { SearchComponent } from '@common-search/search.component';
import { TargetNotificationTemplateService } from '@notification-target-services/target-notification-template.service';
import { CreateUpdateNotificationTemplateModalComponent } from '@notification-template-modals-create-update/create-update-notification-template-modal.component';
import { NotificationTemplateSelectionTableComponent } from '@notification-template-modals-selection/notification-template-selection-table.component';
import { NotificationTemplateTableModel } from '@notification-template-modals-selection-models/notification-template-table.model';
import { NotificationTemplateStatusEnum } from '@notification-template-models-enums/notification-template-status.enum';
import { NotificationTemplateTypeEnum } from '@notification-template-models-enums/notification-template-type.enum';
import { NotificationTemplateService } from '@notification-template-services/notification-template.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-target-notification-template-modal',
  templateUrl: './target-notification-template-modal.component.html',
  styleUrls: ['./target-notification-template-modal.component.scss', '../../../../../../styles.scss'],
  standalone: false,
})
export class TargetNotificationTemplateModalComponent extends CommonComponent {
  @ViewChild(NotificationTemplateSelectionTableComponent)
  notificationTemplateSelectionTableComponent: NotificationTemplateSelectionTableComponent;
  @ViewChild(SearchComponent) searchComponent: SearchComponent;
  @ViewChild('modal') modalComponent: CommonModalComponent;
  @Output() sendNotification = new EventEmitter();

  constructor(
    injector: Injector,
    private eventNotificationTemplateService: TargetNotificationTemplateService,
    private notificationTemplateService: NotificationTemplateService,
    @Inject(MAT_DIALOG_DATA)
    public dialogParams: {
      targetId: string;
      targetName: string;
      dataSourceObs: Observable<Array<NotificationTemplateTableModel>>;
      sendingForm?: boolean;
    },
  ) {
    super(injector);
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.modalComponent.changeCloseWithoutConfirmField(true);
  }

  public isOneRowSelected(): boolean {
    return this.notificationTemplateSelectionTableComponent?.table?.isOneRowSelected();
  }

  public openConcreteNotificationModal(): void {
    const selectedNotificationTemplate: NotificationTemplateTableModel =
        this.notificationTemplateSelectionTableComponent.table?.selection.selected[0],
      type: NotificationTemplateTypeEnum = selectedNotificationTemplate.type,
      isUpdate: boolean = type === NotificationTemplateTypeEnum.CONCRETE_NOTIFICATION_TEMPLATE;

    const matDialogRef = this.newModal.open(CreateUpdateNotificationTemplateModalComponent, {
      data: {
        model: selectedNotificationTemplate,
        notificationTemplateType: type,
        targetId: this.dialogParams.targetId,
        targetName: this.dialogParams.targetName,
        isNotificationConcreteTemplateForm: true,
        isUpdate: isUpdate,
      },
    });

    this.closeConcreteNotificationModalHandler(matDialogRef);
  }

  public closeConcreteNotificationModalHandler(
    matDialogRef: MatDialogRef<CreateUpdateNotificationTemplateModalComponent>,
  ): void {
    matDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.notificationTemplateSelectionTableComponent.loadDataSource();
      }
    });
  }

  isActivateBtnDisable(): boolean {
    const selection = this.notificationTemplateSelectionTableComponent?.table?.selection;

    return (
      !selection?.hasValue() ||
      selection?.selected.some(
        notificationTemplate => notificationTemplate.status.id == NotificationTemplateStatusEnum.ACTIVE,
      )
    );
  }

  isDeactivateBtnDisable(): boolean {
    const selection = this.notificationTemplateSelectionTableComponent?.table?.selection;

    return (
      !selection?.hasValue() ||
      selection?.selected.some(
        notificationTemplate => notificationTemplate.status.id == NotificationTemplateStatusEnum.NOT_ACTIVE,
      )
    );
  }

  changeNotificationTemplateActiveStatus(isActive: boolean): void {
    const selection = this.notificationTemplateSelectionTableComponent?.table?.selection,
      notificationTemplateIds: Array<string> = selection.selected.map(notificationTemplate => notificationTemplate.id);

    if (!isActive) {
      this.showConfirmModal(this.localization.getLocalTextFromKey('notificationTemplateDeactivateConfirmMessage'))
        .afterClosed()
        .subscribe(result => {
          if (result) {
            this.sendRequestOnChangeActiveStatus(notificationTemplateIds, isActive);
          }
        });
    } else {
      this.sendRequestOnChangeActiveStatus(notificationTemplateIds, isActive);
    }
  }

  sendRequestOnChangeActiveStatus(notificationTemplateIds: Array<string>, isActive: boolean) {
    this.notificationTemplateService
      .changeNotificationConcreteTemplatesStatus(notificationTemplateIds, isActive, this.dialogParams.targetId)
      .subscribe({
        next: data => {
          this.notificationTemplateSelectionTableComponent.loadDataSource();
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      });
  }

  isSendBtnDisabled(): boolean {
    if (!this.notificationTemplateSelectionTableComponent?.table?.selection) {
      return true;
    }

    const selectedNotification: Array<NotificationTemplateTableModel> =
        this.notificationTemplateSelectionTableComponent?.table?.selection?.selected,
      isNotSelected: boolean = selectedNotification.length === 0,
      selectedNotActive: boolean = selectedNotification.some(
        notification => notification.status.id == NotificationTemplateStatusEnum.NOT_ACTIVE,
      );

    return isNotSelected || selectedNotActive;
  }

  sendSelectedNotificationByTraining(): void {
    const selectedNotificationTemplateIds: Array<string> =
      this.notificationTemplateSelectionTableComponent.table?.selection.selected.map(
        notificationTemplate => notificationTemplate.id,
      );

    if (selectedNotificationTemplateIds.length > 0) {
      this.sendNotification.emit(selectedNotificationTemplateIds);
    }
  }
}
