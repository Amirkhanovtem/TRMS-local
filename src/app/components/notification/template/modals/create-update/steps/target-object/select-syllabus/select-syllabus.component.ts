import { Component, Injector, Input, OnInit } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { CreateUpdateNotificationTemplateModalComponent } from '@notification-template-modals-create-update/create-update-notification-template-modal.component';
import { NotificationTemplateTargetObjectModel } from '@notification-template-modals-create-update-steps-target-object-models/notification-template-target-object.model';
import { NotificationTemplateTargetObjectTypeEnum } from '@notification-template-modals-create-update-steps-target-object-models/notification-template-target-object-type.enum';
import { SyllabusTemplateModel } from '@syllabus-template-models/syllabus-template.model';
import { SyllabusTemplateService } from '@syllabus-template-services/syllabus-template.service';

@Component({
  selector: 'app-select-syllabus',
  templateUrl: './select-syllabus.component.html',
  styleUrls: ['./select-syllabus.component.scss', '../../../../../../../../../styles.scss'],
  standalone: false,
})
export class SelectSyllabusComponent extends CommonComponent implements OnInit {
  @Input() parent: CreateUpdateNotificationTemplateModalComponent;
  allSyllabusTemplates: Array<NotificationTemplateTargetObjectModel> = [];

  constructor(
    injector: Injector,
    private syllabusTemplateService: SyllabusTemplateService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.loadAllSyllabusTemplates();
  }

  loadAllSyllabusTemplates(): void {
    this.syllabusTemplateService.getSyllabusTemplateListIdNameCode().subscribe({
      next: data => {
        this._transformer(data);
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  private _transformer(syllabusTemplates: Array<SyllabusTemplateModel>): void {
    syllabusTemplates.forEach(syllabusTemplate => {
      const notificationTemplateTargetObject: NotificationTemplateTargetObjectModel =
        new NotificationTemplateTargetObjectModel();
      notificationTemplateTargetObject.id = syllabusTemplate.id;
      notificationTemplateTargetObject.name = syllabusTemplate.name + ' (' + syllabusTemplate.code + ')';
      notificationTemplateTargetObject.objectType = NotificationTemplateTargetObjectTypeEnum.SYLLABUS_TEMPLATE;

      this.allSyllabusTemplates.push(notificationTemplateTargetObject);
    });
  }

  override compareWithFn(item1, item2): boolean {
    return item1.id === item2.id;
  }
}
