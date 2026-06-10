import { Component, Inject, Injector, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { TrainingTemplateCertificateTemplatesPipe } from '@training-template/pipes/training-template-certificate-templates.pipe';
import { TrainingTemplateModel } from '@training-template-models/training-template.model';
import { TrainingTemplateService } from '@training-template-services/training-template.service';

@Component({
  selector: 'app-training-template-selection-modal',
  templateUrl: './training-template-selection-modal.component.html',
  styleUrls: ['./training-template-selection-modal.component.scss', '../../../../../../../styles.scss'],
  standalone: false,
})
export class TrainingTemplateSelectionModalComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChild('modal') modalComponent: CommonModalComponent;

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
      colDef: 'trainingCategory',
      colTitleLocKey: 'attendedTrainingCategoryColTable',
      modelPropertyPath: ['trainingCategory', 'code'],
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
  ];

  constructor(
    private trainingTemplateService: TrainingTemplateService,
    injector: Injector,
    @Inject(MAT_DIALOG_DATA)
    public dialogParams: {
      selectedTrainingTemplates: Array<TrainingTemplateModel>;
    },
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.loadTrainingTemplates();
  }

  private loadTrainingTemplates(): void {
    this.table.loading = true;

    this.trainingTemplateService.list().subscribe({
      next: data => {
        this.table.commonLoadTableHandler(data);
        this.setSelectedRowByPrevModal();
      },
      error: e => {
        this.table.errorResponseHandler(e);
      },
    });
  }

  setSelectedRowByPrevModal(): void {
    const currentRows = this.table.getData(),
      prevRows = this.dialogParams?.selectedTrainingTemplates,
      selectedRows: Array<TrainingTemplateModel> = [];

    for (const prevRow of prevRows) {
      const row = currentRows.filter(row => row.id === prevRow.id)[0];
      selectedRows.push(row);
    }

    this.table.selection.select(...selectedRows);
  }

  closeModal(): void {
    this.modalComponent.modal.close({ save: false });
  }

  saveModal(): void {
    this.modalComponent.modal.close({
      save: true,
      selectedTrainingTemplates: this.table.selection.selected,
    });
  }
}
