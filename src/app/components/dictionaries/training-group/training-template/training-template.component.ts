import { ComponentType } from '@angular/cdk/overlay';
import { Component, Injector, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { LocationService } from '@location-services/location.service';
import { NotificationTemplateModalComponent } from '@notification-template-modals-view/notification-template-modal.component';
import { NotificationTemplateTriggerTargetTypeEnum } from '@notification-template-models-enums/notification-template-trigger-target-type.enum';
import { TrainingTemplateCertificateTemplatesPipe } from '@training-template/pipes/training-template-certificate-templates.pipe';
import { CreateUpdateTrainingTemplateModalComponent } from '@training-template-modals-create-update/create-update-training-template-modal.component';
import { TrainingTemplateService } from '@training-template-services/training-template.service';

@Component({
  selector: 'app-training-template',
  templateUrl: './training-template.component.html',
  styleUrls: ['./training-template.component.scss', '../../../../../styles.scss'],
  standalone: false,
})
export class TrainingTemplateComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;

  public createUpdateComponent: ComponentType<CreateUpdateTrainingTemplateModalComponent> =
    CreateUpdateTrainingTemplateModalComponent;
  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'select',
      colTitleLocKey: 'check',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
    },
    {
      colDef: 'name',
      colTitleLocKey: 'trainingTemplateNameColTable',
    },
    {
      colDef: 'code',
      colTitleLocKey: 'trainingTemplateCodeColTable',
    },
    {
      colDef: 'description',
      colTitleLocKey: 'trainingTemplateDescriptionColTable',
    },
    {
      colDef: 'trainingType',
      colTitleLocKey: 'trainingTemplateTypeColTable',
      modelPropertyPath: ['trainingType', 'name'],
    },
    {
      colDef: 'trainingCategory',
      colTitleLocKey: 'trainingTemplateCategoryColTable',
      modelPropertyPath: ['trainingCategory', 'code'],
    },
    {
      colDef: 'certificateTemplates',
      colTitleLocKey: 'trainingTemplateCertificateTemplateColTable',
      modelPropertyPath: [],
      colVisualValuePipe: new TrainingTemplateCertificateTemplatesPipe(),
    },
    {
      colDef: 'examTemplate',
      colTitleLocKey: 'trainingTemplateExamTemplateColTable',
      modelPropertyPath: ['examTemplate', 'name'],
    },
    {
      colDef: 'format',
      colTitleLocKey: 'trainingTemplateFormatColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
    },
    {
      colDef: 'moduleCount',
      colTitleLocKey: 'trainingTemplateModuleCountColTable',
    },
    {
      colDef: 'templateStatus',
      colTitleLocKey: 'trainingTemplateStatusColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
    },
  ];

  constructor(
    public trainingTemplateService: TrainingTemplateService,
    private modal: MatDialog,
    public locationService: LocationService,
    injector: Injector,
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.loadTrainingTemplates();
  }

  public loadTrainingTemplates(): void {
    this.table.loading = true;

    this.trainingTemplateService.list().subscribe({
      next: data => {
        this.table.commonLoadTableHandler(data);
      },
      error: e => {
        this.table.errorResponseHandler(e);
      },
    });
  }

  openNotifications(): void {
    if (!this.table?.isOneRowSelected()) {
      return;
    }

    this.newModal.open(NotificationTemplateModalComponent, {
      data: {
        targetTemplateId: this.table.selection.selected[0].id,
        targetType: NotificationTemplateTriggerTargetTypeEnum.TRAINING_CATEGORY_AS_TRAINING,
      },
    });
  }
}
