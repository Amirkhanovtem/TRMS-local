import { AfterContentInit, Component, Injector, Input, OnInit } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { CreateUpdateNotificationTemplateModalComponent } from '@notification-template-modals-create-update/create-update-notification-template-modal.component';
import { NotificationTemplateTriggerModel } from '@notification-template-models/notification-template-trigger.model';
import { TrainingCategoryService } from '@training-category-services/training-category.service';

@Component({
  selector: 'app-notification-template-target-object-step',
  templateUrl: './notification-template-target-object-step.component.html',
  styleUrls: ['./notification-template-target-object-step.component.scss', '../../../../../../../../styles.scss'],
  standalone: false,
})
export class NotificationTemplateTargetObjectStepComponent extends CommonComponent implements OnInit, AfterContentInit {
  triggerControl;
  allNotificationTemplateTriggers: Array<NotificationTemplateTriggerModel> = [];
  @Input() parent: CreateUpdateNotificationTemplateModalComponent;

  constructor(
    injector: Injector,
    public trainingCategoryService: TrainingCategoryService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.loadAllNotificationTemplateTriggers();
  }

  ngAfterContentInit(): void {
    this.setControls();
  }

  setControls(): void {
    this.triggerControl = this.parent.getValidator('trigger');
  }

  loadAllNotificationTemplateTriggers(): void {
    this.parent.notificationTemplateService.getAllNotificationTemplateTriggers().subscribe({
      next: data => {
        this.allNotificationTemplateTriggers = data;
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  isShowSelectForTraining(): boolean {
    return (
      !this.parent.dialogParams?.isNotificationConcreteTemplateForm &&
      this.parent.notificationTemplate.trigger?.targetType === 'TRAINING_CATEGORY_AS_TRAINING'
    );
  }

  isShowSelectForSyllabus(): boolean {
    return (
      !this.parent.dialogParams?.isNotificationConcreteTemplateForm &&
      this.parent.notificationTemplate.trigger?.targetType === 'SYLLABUS_TEMPLATE'
    );
  }

  isTriggerSelectDisabled(): boolean {
    return this.parent.dialogParams?.isView || this.parent.dialogParams?.isNotificationConcreteTemplateForm;
  }
}
