import { Component, Input, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CommonComponent } from '@common-components/common.component';
import { getNewUuid } from '@components/common/functions/uuid.functions';
import { CreateUpdateNotificationTemplateModalComponent } from '@notification-template-modals-create-update/create-update-notification-template-modal.component';
import { AdditionalTargetEmailTableComponent } from '@notification-template-modals-create-update-steps-target-audience-add-target-email-table/additional-target-email-table.component';
import { AdditionalTargetEmailModel } from '@notification-template-modals-create-update-steps-target-audience-add-target-email-table-models/additional-target-email.model';
import { AdditionalEmailType } from '@notification-template-models-enums/additional-email-type.enum';

@Component({
  selector: 'app-additional-target-audience-email',
  templateUrl: './additional-target-audience-email.component.html',
  styleUrls: ['./additional-target-audience-email.component.scss', '../../../../../../../../../styles.scss'],
  standalone: false,
})
export class AdditionalTargetAudienceEmailComponent extends CommonComponent {
  additionalTargetEmailControl = new FormControl('', Validators.email);
  newAdditionalTargetEmail: string;
  @Input() parent: CreateUpdateNotificationTemplateModalComponent;
  @Input() additionalEmailType: AdditionalEmailType;
  @Input() isView: boolean;
  @ViewChild(AdditionalTargetEmailTableComponent)
  additionalTargetEmailTableComponent: AdditionalTargetEmailTableComponent;

  isNewAdditionalTargetEmailValid(): boolean {
    return this.newAdditionalTargetEmail && this.additionalTargetEmailControl.valid && this.isUniqueEmail();
  }

  isUniqueEmail(): boolean {
    return !this.getAdditionalTargetEmailsByType()?.some(ate => {
      return ate.email === this.newAdditionalTargetEmail;
    });
  }

  addNewAdditionalTargetEmail(): void {
    if (!this.isNewAdditionalTargetEmailValid()) {
      return;
    }

    const newAdditionalTargetEmail: AdditionalTargetEmailModel = this.createNewAdditionalTargetEmailModel();

    this.parent.notificationTemplate.additionalTargetEmails.push(newAdditionalTargetEmail);
    this.additionalTargetEmailTableComponent.updateTableDataSource();

    this.newAdditionalTargetEmail = null;
  }

  createNewAdditionalTargetEmailModel(): AdditionalTargetEmailModel {
    const newAdditionalTargetEmail: AdditionalTargetEmailModel = new AdditionalTargetEmailModel();

    newAdditionalTargetEmail.id = getNewUuid();
    newAdditionalTargetEmail.email = this.newAdditionalTargetEmail;
    newAdditionalTargetEmail.type = this.additionalEmailType;

    return newAdditionalTargetEmail;
  }

  getAdditionalTargetEmailsByType(): Array<AdditionalTargetEmailModel> {
    return this.parent.notificationTemplate.additionalTargetEmails?.filter(ate => {
      return ate.type === this.additionalEmailType;
    });
  }
}
