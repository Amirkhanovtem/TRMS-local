import { AfterContentInit, Component, Injector, Input, OnInit } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { CommonDateTimeService } from '@common-services/common-date-time.service';
import { CreateUpdateNotificationTemplateModalComponent } from '@notification-template-modals-create-update/create-update-notification-template-modal.component';
import { SendingTypeEnum } from '@notification-template-models-enums/sending-type.enum';

@Component({
  selector: 'app-notification-template-time-step',
  templateUrl: './notification-template-time-step.component.html',
  styleUrls: ['./notification-template-time-step.component.scss', '../../../../../../../../styles.scss'],
  standalone: false,
})
export class NotificationTemplateTimeStepComponent extends CommonComponent implements OnInit, AfterContentInit {
  sendingTypeControl;
  offsetCountControl;
  offsetTypeControl;
  mainSendingTimeControl;
  allSendingType: Array<StandardEnumModel> = [];
  allOffsetType: Array<StandardEnumModel> = [];
  @Input() parent: CreateUpdateNotificationTemplateModalComponent;

  constructor(
    injector: Injector,
    public commonDateTimeService: CommonDateTimeService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.loadAllSendingType();
    this.loadAllOffsetType();
  }

  ngAfterContentInit(): void {
    this.setControls();
  }

  setControls(): void {
    this.sendingTypeControl = this.parent.getValidator('sendingType');
    this.offsetCountControl = this.parent.getValidator('offsetCount');
    this.offsetTypeControl = this.parent.getValidator('offsetType');
    this.mainSendingTimeControl = this.parent.getValidator('mainSendingTime');

    this.setAllValidators();
  }

  loadAllSendingType(): void {
    this.parent.notificationTemplateService.getAllNotificationTemplateSendingTypes().subscribe({
      next: data => {
        this.allSendingType = data;
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  loadAllOffsetType(): void {
    this.parent.notificationTemplateService.getAllNotificationTemplateOffsetTypes().subscribe({
      next: data => {
        this.allOffsetType = data;
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  isSelectedSendingTypeBeforeOrAfter(): boolean {
    return this.isSelectedSendingTypeBefore() || this.isSelectedSendingTypeAfter();
  }

  isSelectedSendingTypeBefore(): boolean {
    return this.parent.notificationTemplate.sendingType?.id === SendingTypeEnum.BEFORE;
  }

  isSelectedSendingTypeAfter(): boolean {
    return this.parent.notificationTemplate.sendingType?.id === SendingTypeEnum.AFTER;
  }

  isOffsetTypeDay(): boolean {
    return this.parent.notificationTemplate.offsetType?.id === 'DAY';
  }

  changeOffsetTypeHandler(): void {
    this.updateValidatorsByOffsetType();
  }

  updateValidatorsByOffsetType(): void {
    if (this.parent.notificationTemplate.offsetType?.id === 'DAY') {
      this.setValidatorsByOffsetType();
    } else {
      this.removeValidatorsByOffsetType();
    }

    this.cdref.detectChanges();
  }

  removeValidatorsByOffsetType(): void {
    this.parent.disableValidator('mainSendingTime');
  }

  setValidatorsByOffsetType(): void {
    this.parent.enableValidator('mainSendingTime', this.mainSendingTimeControl);
  }

  changeSendingTypeHandler(): void {
    this.updateValidatorsBySendingType();
  }

  updateValidatorsBySendingType(): void {
    if (this.isSelectedSendingTypeBeforeOrAfter()) {
      this.setValidatorsBySendingType();
    } else {
      this.removeValidatorsBySendingType();
    }

    this.cdref.detectChanges();
  }

  setValidatorsBySendingType(): void {
    this.parent.enableValidator('offsetCount', this.offsetCountControl);
    this.parent.enableValidator('offsetType', this.offsetTypeControl);
  }

  removeValidatorsBySendingType(): void {
    this.parent.disableValidator('offsetCount');
    this.parent.disableValidator('offsetType');
    this.parent.disableValidator('mainSendingTime');
  }

  setAllValidators(): void {
    this.updateValidatorsBySendingType();
    this.updateValidatorsByOffsetType();
  }
}
