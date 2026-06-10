import { AfterContentInit, Component, Input, OnInit } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { CreateUpdateNotificationTemplateModalComponent } from '@notification-template-modals-create-update/create-update-notification-template-modal.component';
import { AdditionalEmailType } from '@notification-template-models-enums/additional-email-type.enum';

@Component({
  selector: 'app-notification-template-target-audience-step',
  templateUrl: './notification-template-target-audience-step.component.html',
  styleUrls: ['./notification-template-target-audience-step.component.scss', '../../../../../../../../styles.scss'],
  standalone: false,
})
export class NotificationTemplateTargetAudienceStepComponent
  extends CommonComponent
  implements OnInit, AfterContentInit
{
  mainAdditionalEmailType: AdditionalEmailType = AdditionalEmailType.MAIN;
  copyAdditionalEmailType: AdditionalEmailType = AdditionalEmailType.COPY;
  mainTargetAudienceControl;
  allTargetAudiences: Array<StandardEnumModel> = [];
  @Input() parent: CreateUpdateNotificationTemplateModalComponent;

  ngOnInit(): void {
    this.loadAllTargetAudiencesBySelectedTrigger();
  }

  ngAfterContentInit(): void {
    this.setControls();
  }

  setControls(): void {
    this.mainTargetAudienceControl = this.parent.getValidator('mainTargetAudience');
  }

  loadAllTargetAudiencesBySelectedTrigger(): void {
    const triggerId: string = this.parent?.notificationTemplate?.trigger?.id;

    if (!triggerId) {
      return;
    }

    this.parent.notificationTemplateService.getAllNotificationTemplateTargetAudiencesByTrigger(triggerId).subscribe({
      next: data => {
        this.loadNotificationTemplateTargetAudiencesSuccessHandler(data);
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  loadNotificationTemplateTargetAudiencesSuccessHandler(data: Array<StandardEnumModel>): void {
    this.allTargetAudiences = data;
  }

  selectedAdditionalEmails(selectedTargetAudience: Array<StandardEnumModel>): boolean {
    return selectedTargetAudience.some(ta => {
      return ta.id === 'ADDITIONAL_EMAILS';
    });
  }
}
