import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { AttachmentInfoTableComponent } from '@attachment-info-table/attachment-info-table.component';
import { AttachmentInfoTableTypeEnum } from '@attachment-info-table-models/attachment-info-table-type.enum';
import { CommonCreateUpdateComponents } from '@common-components/common-create-update.components';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { EntityExceptionEnum } from '@common-models/response-exceptions/entity-exception.enum';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { NotificationTemplateEditorStepComponent } from '@notification-template-modals-create-update-steps-editor/notification-template-editor-step.component';
import { NotificationTemplateTargetAudienceStepComponent } from '@notification-template-modals-create-update-steps-target-audience/notification-template-target-audience-step.component';
import { NotificationTemplateModel } from '@notification-template-models/notification-template.model';
import { NotificationTemplateTriggerModel } from '@notification-template-models/notification-template-trigger.model';
import { NotificationTemplateStatusEnum } from '@notification-template-models-enums/notification-template-status.enum';
import { NotificationTemplateTypeEnum } from '@notification-template-models-enums/notification-template-type.enum';
import { NotificationTemplateService } from '@notification-template-services/notification-template.service';

@Component({
  selector: 'app-create-update-notification-template-modal',
  templateUrl: './create-update-notification-template-modal.component.html',
  styleUrls: ['./create-update-notification-template-modal.component.scss', '../../../../../../styles.scss'],
  standalone: false,
})
export class CreateUpdateNotificationTemplateModalComponent
  extends CommonCreateUpdateComponents<NotificationTemplateModel>
  implements OnInit
{
  @ViewChild('editorStep') editorStepComponent: NotificationTemplateEditorStepComponent;
  @ViewChild('targetAudienceStep') targetAudienceStepComponent: NotificationTemplateTargetAudienceStepComponent;
  @ViewChild('matStepper') matStepper: MatStepper;
  @ViewChild('modal') modalComponent: CommonModalComponent;

  public notificationTemplate: NotificationTemplateModel = new NotificationTemplateModel();
  public override dialogParams: {
    model: NotificationTemplateModel;
    notificationTemplateType?: NotificationTemplateTypeEnum;
    targetId?: string;
    targetName?: string;
    isNotificationConcreteTemplateForm?: boolean;
    isUpdate?: boolean;
    isView?: boolean;
  };

  constructor(
    injector: Injector,
    public notificationTemplateService: NotificationTemplateService,
  ) {
    super(injector);
    this.createForm();
  }

  ngOnInit() {
    this.loadNotification();
  }

  createForm() {
    this.modalForm = this.formBuilder.group({
      name: ['', [Validators.required, this.noWhitespaceValidator]],
      code: ['', [Validators.required, this.noWhitespaceValidator]],
      trigger: ['', [Validators.required]],
      sendingType: ['', [Validators.required]],
      offsetCount: ['', [Validators.required, Validators.min(1)]],
      offsetType: ['', [Validators.required]],
      mainSendingTime: ['', [Validators.required]],
      repeatCount: ['', [Validators.required, Validators.min(1)]],
      repeatSendingTime: ['', [Validators.required]],
      repeatType: ['', [Validators.required]],
      repeatDayPeriod: ['', [Validators.required, Validators.min(1)]],
      repeatDayOfWeek: ['', [Validators.required]],
      mainTargetAudience: ['', [Validators.required]],
      fromName: ['', [Validators.required, this.noWhitespaceValidator]],
      emailSubject: ['', [Validators.required, this.noWhitespaceValidator]],
    });
  }

  loadNotification(): void {
    if (
      this.dialogParams?.isView ||
      this.dialogParams?.isUpdate ||
      this.dialogParams?.isNotificationConcreteTemplateForm
    ) {
      switch (this.dialogParams.notificationTemplateType) {
        case NotificationTemplateTypeEnum.GENERAL_NOTIFICATION_TEMPLATE: {
          this.loadGeneralNotificationTemplate();
          break;
        }
        case NotificationTemplateTypeEnum.CONCRETE_NOTIFICATION_TEMPLATE: {
          this.loadConcreteNotificationTemplate();
          break;
        }
        default: {
          this.loadGeneralNotificationTemplate();
        }
      }
    }
  }

  loadConcreteNotificationTemplate(): void {
    this.notificationTemplateService
      .getNotificationConcreteTemplateById(this.dialogParams.model.id)
      .subscribe({
        next: data => {
          this.loadNotificationTemplateSuccessHandler(data);
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      })
      .add(() => this.cdref.detectChanges());
  }

  loadGeneralNotificationTemplate(): void {
    this.notificationTemplateService
      .getNotificationTemplateById(this.dialogParams.model.id)
      .subscribe({
        next: data => {
          this.loadNotificationTemplateSuccessHandler(data);
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      })
      .add(() => this.cdref.detectChanges());
  }

  loadNotificationTemplateSuccessHandler(data: NotificationTemplateModel): void {
    this.notificationTemplate = data;
    this.loadEnumsBySelectedTrigger();
  }

  createUpdateNotificationTemplate(): void {
    if (this.modalForm.valid) {
      this.startCreateHandler();
      if (this.dialogParams?.isNotificationConcreteTemplateForm) {
        this.dialogParams?.isUpdate
          ? this.updateNotificationConcreteTemplate()
          : this.createNotificationConcreteTemplate();
      } else {
        this.dialogParams?.isUpdate ? this.update() : this.create();
      }
    } else {
      this.showSnackBarWithMessage(this.localization.getLocalTextFromKey('fillAllRequiredFieldsErrorMessage'));
    }
  }

  updateNotificationConcreteTemplate(): void {
    this.notificationTemplateService
      .updateNotificationConcreteTemplate(this.notificationTemplate)
      .subscribe({
        next: data => {
          this.modalComponent.closeCurrentModal(true);
        },
        error: e => {
          this.errorHandler(e);
        },
      })
      .add(() => this.standardCompleteHandler());
  }

  createNotificationConcreteTemplate(): void {
    this.notificationTemplateService
      .createNotificationConcreteTemplate(this.notificationTemplate, this.dialogParams.targetId)
      .subscribe({
        next: data => {
          this.modalComponent.closeCurrentModal(true);
        },
        error: e => {
          this.errorHandler(e);
        },
      })
      .add(() => this.standardCompleteHandler());
  }

  update(): void {
    this.notificationTemplateService
      .update(this.notificationTemplate)
      .subscribe({
        next: data => {
          this.modalComponent.closeCurrentModal(true);
        },
        error: e => {
          this.errorHandler(e);
        },
      })
      .add(() => this.standardCompleteHandler());
  }

  create(): void {
    this.notificationTemplateService
      .create(this.notificationTemplate)
      .subscribe({
        next: data => {
          this.modalComponent.closeCurrentModal(true);
        },
        error: e => {
          this.errorHandler(e);
        },
      })
      .add(() => this.standardCompleteHandler());
  }

  errorHandler(error) {
    const errorBody = error.error,
      contents = errorBody.contents;

    if (!contents || contents.length <= 0) {
      this.errorResponseHandler(error);
      return;
    }

    contents.forEach(content => {
      switch (content.type) {
        case EntityExceptionEnum.UNIQUENESS_CHECK_EXCEPTION_CONTENT: {
          this.uniquenessErrorHandler(content);
          break;
        }
        default:
          this.errorResponseHandler(error);
      }
    });

    this.hideLoadPage();
  }

  uniquenessErrorHandler(content) {
    content.errorCauses.forEach(errorCause => {
      switch (errorCause.field) {
        case 'code':
          this.setErrorOnValidator('code', content.type);
          break;
      }
    });
  }

  openAttachmentsModal(): void {
    this.newModal.open(AttachmentInfoTableComponent, {
      data: {
        title: this.localization.getLocalTextFromKey('loadAttachmentsModalTitle'),
        attachments: this.notificationTemplate.fileStorages,
        type: AttachmentInfoTableTypeEnum.TEMPORAL,
        isView: this.dialogParams?.isView,
      },
    });
  }

  createUpdate(saveAsDraft: boolean): void {
    const statusId: NotificationTemplateStatusEnum = saveAsDraft
      ? NotificationTemplateStatusEnum.NOT_ACTIVE
      : NotificationTemplateStatusEnum.ACTIVE;

    this.notificationTemplate.saveAsDraft = saveAsDraft;
    this.notificationTemplate.status = this.createNotificationTemplateStatus(statusId);
    this.notificationTemplate.body = this.editorStepComponent?.jodit.value;
    this.createUpdateNotificationTemplate();
  }

  createNotificationTemplateStatus(statusId: NotificationTemplateStatusEnum): StandardEnumModel {
    const status = new StandardEnumModel();
    status.id = statusId;

    return status;
  }

  isLastStep(): boolean {
    return this.matStepper?.steps.last === this.matStepper?.selected;
  }

  changeTriggerHandler(notificationTemplateTrigger: NotificationTemplateTriggerModel): void {
    if (notificationTemplateTrigger.targetType !== this.notificationTemplate.trigger?.targetType) {
      this.notificationTemplate.targetObjects = [];
    }
    this.loadEnumsBySelectedTrigger();
    this.clearSelectedTargetAudience();
  }

  clearSelectedTargetAudience(): void {
    this.notificationTemplate.mainTargetAudience = [];
    this.notificationTemplate.copyTargetAudience = [];
  }

  loadEnumsBySelectedTrigger(): void {
    this.targetAudienceStepComponent.loadAllTargetAudiencesBySelectedTrigger();
    this.editorStepComponent.loadAllKeyWordsBySelectedTrigger();
  }
}
