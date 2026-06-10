import { AfterContentInit, Component, Input } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { CreateUpdateNotificationTemplateModalComponent } from '@notification-template-modals-create-update/create-update-notification-template-modal.component';

@Component({
  selector: 'app-notification-template-general-settings-step',
  templateUrl: './notification-template-general-settings-step.component.html',
  styleUrls: ['./notification-template-general-settings-step.component.scss', '../../../../../../../../styles.scss'],
  standalone: false,
})
export class NotificationTemplateGeneralSettingsStepComponent extends CommonComponent implements AfterContentInit {
  nameControl;
  codeControl;
  @Input() parent: CreateUpdateNotificationTemplateModalComponent;

  ngAfterContentInit(): void {
    this.setControls();
  }

  setControls(): void {
    this.nameControl = this.parent.getValidator('name');
    this.codeControl = this.parent.getValidator('code');
  }
}
