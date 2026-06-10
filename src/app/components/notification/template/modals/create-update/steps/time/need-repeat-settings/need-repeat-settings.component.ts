import { AfterContentInit, Component, Injector, Input, OnInit } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { CommonDateTimeService } from '@common-services/common-date-time.service';
import { CreateUpdateNotificationTemplateModalComponent } from '@notification-template-modals-create-update/create-update-notification-template-modal.component';
import { RepeatTypeEnum } from '@notification-template-models-enums/repeat-type.enum';

@Component({
  selector: 'app-need-repeat-settings',
  templateUrl: './need-repeat-settings.component.html',
  styleUrls: [
    './need-repeat-settings.component.scss',
    '../../../../../../../../../styles.scss',
    '../notification-template-time-step.component.scss',
  ],
  standalone: false,
})
export class NeedRepeatSettingsComponent extends CommonComponent implements OnInit, AfterContentInit {
  repeatCountControl;
  repeatSendingTimeControl;
  repeatTypeControl;
  repeatDayPeriodControl;
  repeatDayOfWeekControl;
  allRepeatType: Array<StandardEnumModel> = [];
  @Input() parent: CreateUpdateNotificationTemplateModalComponent;

  constructor(
    injector: Injector,
    public commonDateTimeService: CommonDateTimeService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.loadAllRepeatTypes();
  }

  ngAfterContentInit(): void {
    this.setControls();
  }

  loadAllRepeatTypes(): void {
    this.parent.notificationTemplateService.getAllNotificationTemplateRepeatTypes().subscribe({
      next: data => {
        this.allRepeatType = data;
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  setControls(): void {
    this.repeatCountControl = this.parent.getValidator('repeatCount');
    this.repeatSendingTimeControl = this.parent.getValidator('repeatSendingTime');
    this.repeatTypeControl = this.parent.getValidator('repeatType');
    this.repeatDayPeriodControl = this.parent.getValidator('repeatDayPeriod');
    this.repeatDayOfWeekControl = this.parent.getValidator('repeatDayOfWeek');

    this.setValidators();
  }

  isRepeatTypePerDay(): boolean {
    return this.parent.notificationTemplate.repeatType?.id === RepeatTypeEnum.PER_DAY;
  }

  isRepeatTypeDayOfWeek(): boolean {
    return this.parent.notificationTemplate.repeatType?.id === RepeatTypeEnum.PER_DAY_OF_WEEK;
  }

  changeRepeatTypeHandler(): void {
    this.updateValidatorsByRepeatType();
  }

  updateValidatorsByRepeatType(): void {
    this.setValidatorsByRepeatType();
    this.removeValidatorsByRepeatType();
    this.cdref.detectChanges();
  }

  setValidatorsByRepeatType(): void {
    switch (this.parent.notificationTemplate.isRepeatable && this.parent.notificationTemplate.repeatType?.id) {
      case RepeatTypeEnum.PER_DAY: {
        this.parent.enableValidator('repeatDayPeriod', this.repeatDayPeriodControl);
        break;
      }
      case RepeatTypeEnum.PER_DAY_OF_WEEK: {
        this.parent.enableValidator('repeatDayOfWeek', this.repeatDayOfWeekControl);
        break;
      }
    }
  }

  removeValidatorsByRepeatType(): void {
    if (
      !this.parent.notificationTemplate.isRepeatable ||
      this.parent.notificationTemplate.repeatType?.id !== RepeatTypeEnum.PER_DAY
    ) {
      this.parent.disableValidator('repeatDayPeriod');
    }

    if (
      !this.parent.notificationTemplate.isRepeatable ||
      this.parent.notificationTemplate.repeatType?.id !== RepeatTypeEnum.PER_DAY_OF_WEEK
    ) {
      this.parent.disableValidator('repeatDayOfWeek');
    }
  }

  changeNeedRepeatHandler(): void {
    this.updateValidatorsByNeedRepeat();
    this.updateValidatorsByRepeatType();
  }

  updateValidatorsByNeedRepeat(): void {
    if (this.parent.notificationTemplate.isRepeatable) {
      this.setValidatorsByNeedRepeat();
    } else {
      this.removeValidatorsByNeedRepeat();
    }
    this.cdref.detectChanges();
  }

  setValidatorsByNeedRepeat(): void {
    this.parent.enableValidator('repeatCount', this.repeatCountControl);
    this.parent.enableValidator('repeatSendingTime', this.repeatSendingTimeControl);
    this.parent.enableValidator('repeatType', this.repeatTypeControl);
  }

  removeValidatorsByNeedRepeat(): void {
    this.parent.disableValidator('repeatCount');
    this.parent.disableValidator('repeatSendingTime');
    this.parent.disableValidator('repeatType');
  }

  setValidators(): void {
    this.updateValidatorsByNeedRepeat();
    this.updateValidatorsByRepeatType();
  }
}
