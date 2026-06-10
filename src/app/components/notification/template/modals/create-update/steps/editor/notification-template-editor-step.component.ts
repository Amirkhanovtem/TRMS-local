import { AfterContentInit, Component, Injector, Input, ViewChild } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { JoditService } from '@jodit/jodit.service';
import { CreateUpdateNotificationTemplateModalComponent } from '@notification-template-modals-create-update/create-update-notification-template-modal.component';
import { JoditAngularComponent } from 'jodit-angular';

@Component({
  selector: 'app-notification-template-editor-step',
  templateUrl: './notification-template-editor-step.component.html',
  styleUrls: ['./notification-template-editor-step.component.scss', '../../../../../../../../styles.scss'],
  standalone: false,
})
export class NotificationTemplateEditorStepComponent extends CommonComponent implements AfterContentInit {
  fromNameControl;
  emailSubjectControl;
  allKeyWords: Array<StandardEnumModel> = [];
  @Input() parent: CreateUpdateNotificationTemplateModalComponent;
  @ViewChild(JoditAngularComponent) jodit: JoditAngularComponent;

  constructor(
    injector: Injector,
    private joditService: JoditService,
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.loadAllKeyWordsBySelectedTrigger();
  }

  ngAfterContentInit(): void {
    this.setControls();
  }

  setControls(): void {
    this.fromNameControl = this.parent.getValidator('fromName');
    this.emailSubjectControl = this.parent.getValidator('emailSubject');
  }

  loadAllKeyWordsBySelectedTrigger(): void {
    const triggerId: string = this.parent?.notificationTemplate?.trigger?.id;

    if (!triggerId) {
      return;
    }

    this.parent.notificationTemplateService.getAllNotificationTemplateKeyWordsByTrigger(triggerId).subscribe({
      next: data => {
        this.loadKeyWordsSuccessHandler(data);
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  loadKeyWordsSuccessHandler(data): void {
    this.allKeyWords = data;
    this.setJoditConfig();
  }

  setJoditConfig(): void {
    const isView: boolean = this.parent.dialogParams?.isView;

    this.jodit.config = {
      toolbarAdaptive: false,
      readonly: isView,
      uploader: {
        insertImageAsBase64URI: true,
      },
      height: 500,
      buttons: isView ? this.joditService.getBtnsForView() : this.joditService.getDefaultButtons(),
      extraButtons: isView ? [] : [this.getKeyWordsButton()],
    };
  }

  getKeyWordsButton(): any {
    return this.joditService.getDefaultButtonList(
      this.localization.getLocalTextFromKey('joditKeyWordButton'),
      this.allKeyWords,
      this.localEnumField,
    );
  }
}
